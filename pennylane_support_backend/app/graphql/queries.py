# app/graphql/queries.py
import graphene
from app.extensions import db
from app.models.challenge import Challenge, Tag
from app.models.support import SupportConversation
from .types import (
    ChallengeType,
    SupportConversationType,
    TagType,
    PaginatedConversationsType,
    PaginatedChallengesType,
)

class Query(graphene.ObjectType):
    # existing list (kept for compatibility)
    challenges = graphene.List(ChallengeType, search=graphene.String(), tag=graphene.String())
    challenge = graphene.Field(ChallengeType, public_id=graphene.String(required=True))
    conversations_by_challenge = graphene.List(
        SupportConversationType, challenge_public_id=graphene.String(required=True)
    )
    tags = graphene.List(TagType)

    # paged conversations (already in place in your project)
    conversations_paged = graphene.Field(
        PaginatedConversationsType,
        status=graphene.String(),
        category=graphene.String(),
        search=graphene.String(),
        challenge_public_id=graphene.String(),
        page=graphene.Int(default_value=1),
        page_size=graphene.Int(default_value=12),
    )

    # NEW: paged challenges
    challenges_paged = graphene.Field(
        PaginatedChallengesType,
        search=graphene.String(),
        tag=graphene.String(),
        page=graphene.Int(default_value=1),
        page_size=graphene.Int(default_value=12),
    )

    # ---- resolvers ----

    def resolve_challenges(self, info, search=None, tag=None):
        q = db.session.query(Challenge)
        if search:
            like = f"%{search}%"
            q = q.filter((Challenge.title.ilike(like)) | (Challenge.description.ilike(like)))
        if tag:
            q = q.join(Challenge.tags).filter(Tag.name == tag)
        return q.order_by(Challenge.points.desc()).all()

    def resolve_challenge(self, info, public_id):
        return db.session.query(Challenge).filter_by(public_id=public_id).first()

    def resolve_conversations_by_challenge(self, info, challenge_public_id):
        return (
            db.session.query(SupportConversation)
            .join(SupportConversation.challenge)
            .filter(Challenge.public_id == challenge_public_id)
            .all()
        )

    def resolve_tags(self, info):
        return db.session.query(Tag).order_by(Tag.name).all()

    def resolve_conversations_paged(
        self, info, status=None, category=None, search=None,
        challenge_public_id=None, page=1, page_size=12
    ):
        q = db.session.query(SupportConversation)
        if status:
            q = q.filter(SupportConversation.status == status)
        if category:
            q = q.filter(SupportConversation.category == category)
        if search:
            like = f"%{search}%"
            q = q.filter(SupportConversation.topic.ilike(like))
        if challenge_public_id:
            q = q.join(SupportConversation.challenge).filter(Challenge.public_id == challenge_public_id)

        total = q.count()
        items = (
            q.order_by(SupportConversation.created_at.desc())
            .offset(max(0, (page - 1) * page_size))
            .limit(page_size)
            .all()
        )
        return PaginatedConversationsType(items=items, total=total)

    def resolve_challenges_paged(self, info, search=None, tag=None, page=1, page_size=12):
        q = db.session.query(Challenge)
        if search:
            like = f"%{search}%"
            q = q.filter((Challenge.title.ilike(like)) | (Challenge.description.ilike(like)))
        if tag:
            q = q.join(Challenge.tags).filter(Tag.name == tag)

        total = q.count()
        items = (
            q.order_by(Challenge.points.desc())
            .offset(max(0, (page - 1) * page_size))
            .limit(page_size)
            .all()
        )
        return PaginatedChallengesType(items=items, total=total)
