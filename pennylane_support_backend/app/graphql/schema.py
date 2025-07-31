import graphene
from app.graphql.queries import Query
from app.graphql.mutations.user_mutations import SyncUser

class Mutation(graphene.ObjectType):
    sync_user = SyncUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
