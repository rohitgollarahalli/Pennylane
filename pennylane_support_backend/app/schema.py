import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from app.models import User, Challenge
from app import db

class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User

class ChallengeType(SQLAlchemyObjectType):
    class Meta:
        model = Challenge
        exclude_fields = ('hints', 'objectives', 'conversations')

class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    all_challenges = graphene.List(ChallengeType)

    def resolve_all_users(parent, info):
        return db.session.query(User).all()

    def resolve_all_challenges(parent, info):
        return db.session.query(Challenge).all()

schema = graphene.Schema(query=Query)
