# app/graphql/schema.py
import graphene
from .queries import Query
from .mutations.user_mutations import SyncUser
from .mutations.conversation_mutations import (
    CreateConversation, AddPost, AssignConversation, UpdateConversationStatus
)

class Mutation(graphene.ObjectType):
    sync_user = SyncUser.Field()
    create_conversation = CreateConversation.Field()
    add_post = AddPost.Field()
    assign_conversation = AssignConversation.Field()
    update_conversation_status = UpdateConversationStatus.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
