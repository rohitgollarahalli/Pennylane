# app/graphql/mutations/conversation_mutations.py
import graphene, uuid
from flask import g
from app.models.user import User
from app.extensions import db
from app.graphql.types import SupportConversationType, ConversationPostType
from app.models.support import SupportConversation, ConversationPost
from app.models.challenge import Challenge
from app.auth import requires_auth

def _gen_identifier():
    # short, human-friendly-ish ID
    return f"CONV_{uuid.uuid4().hex[:8].upper()}"

class CreateConversation(graphene.Mutation):
    class Arguments:
        challenge_public_id = graphene.String(required=True)
        topic = graphene.String(required=True)
        category = graphene.String(required=True)
        first_post = graphene.String(required=False)   # <-- make this optional

    ok = graphene.Boolean()
    conversation = graphene.Field(lambda: SupportConversationType)

    @requires_auth
    def mutate(self, info, challenge_public_id, topic, category, first_post=None):
        challenge = Challenge.query.filter_by(public_id=challenge_public_id).first()
        conv = SupportConversation(
            identifier=_gen_identifier(),   # <-- ensure NOT NULL
            topic=topic,
            category=category,
            challenge=challenge,
            status="OPEN",
        )
        db.session.add(conv)
        db.session.flush()  # get conv.id

        if first_post:
            post = ConversationPost(
                conversation_id=conv.id,
                content=first_post,
                author_display_name="User",
            )
            db.session.add(post)

        db.session.commit()
        return CreateConversation(ok=True, conversation=conv)

class AddPost(graphene.Mutation):
    class Arguments:
        conversation_id = graphene.Int(required=True)
        content = graphene.String(required=True)
        author_display_name = graphene.String(required=False)

    ok = graphene.Boolean()
    post = graphene.Field(lambda: ConversationPostType)

    @requires_auth
    def mutate(self, info, conversation_id, content, author_display_name=None):
        if not content.strip():
            return AddPost(ok=False, post=None)

        author_user_id = None
        try:
            auth0_sub = g.current_user.get("sub")
            if auth0_sub:
                user = User.query.filter_by(auth0_id=auth0_sub).first()
                if user:
                    author_user_id = user.id
        except Exception:
            pass

        post = ConversationPost(
            conversation_id=conversation_id,
            content=content.strip(),
            author_user_id=author_user_id,
            author_display_name=author_display_name,
        )
        db.session.add(post)
        db.session.commit()
        return AddPost(ok=True, post=post)

class AssignConversation(graphene.Mutation):
    class Arguments:
        conversation_id = graphene.Int(required=True)
        assigned_to_user_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    def mutate(self, info, conversation_id, assigned_to_user_id):
        conv = SupportConversation.query.get(conversation_id)
        conv.assigned_to_user_id = assigned_to_user_id
        conv.status = "ASSIGNED"
        db.session.commit()
        return AssignConversation(ok=True)

class UpdateConversationStatus(graphene.Mutation):
    class Arguments:
        conversation_id = graphene.Int(required=True)
        status = graphene.String(required=True)

    ok = graphene.Boolean()
    def mutate(self, info, conversation_id, status):
        conv = SupportConversation.query.get(conversation_id)
        conv.status = status
        db.session.commit()
        return UpdateConversationStatus(ok=True)
