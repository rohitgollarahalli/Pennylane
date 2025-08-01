# app/graphql/types.py
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from app.models.user import User
from app.models.challenge import Challenge, ChallengeHint, LearningObjective, Tag
from app.models.support import SupportConversation, ConversationPost

# ---- Base entity types ----

class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User

class TagType(SQLAlchemyObjectType):
    class Meta:
        model = Tag

class ChallengeHintType(SQLAlchemyObjectType):
    class Meta:
        model = ChallengeHint

class LearningObjectiveType(SQLAlchemyObjectType):
    class Meta:
        model = LearningObjective

class ConversationPostType(SQLAlchemyObjectType):
    class Meta:
        model = ConversationPost

class SupportConversationType(SQLAlchemyObjectType):
    class Meta:
        model = SupportConversation

    posts = graphene.List(lambda: ConversationPostType)

    def resolve_posts(parent, info):
        return parent.posts

class ChallengeType(SQLAlchemyObjectType):
    class Meta:
        model = Challenge

    conversations = graphene.List(lambda: SupportConversationType)
    hints = graphene.List(lambda: ChallengeHintType)
    learning_objectives = graphene.List(lambda: LearningObjectiveType)

    def resolve_conversations(parent, info):
        return parent.conversations

    def resolve_hints(parent, info):
        return parent.hints

    def resolve_learning_objectives(parent, info):
        return parent.learning_objectives

# ---- Pagination wrappers ----

class PaginatedConversationsType(graphene.ObjectType):
    items = graphene.List(SupportConversationType)
    total = graphene.Int()

class PaginatedChallengesType(graphene.ObjectType):
    items = graphene.List(ChallengeType)
    total = graphene.Int()
