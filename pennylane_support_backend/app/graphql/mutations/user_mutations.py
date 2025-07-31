import graphene
from app.models import User, db

class SyncUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        username = graphene.String(required=True) 
        auth0Id = graphene.String(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, email, username, auth0Id):  
        user = User.query.filter_by(auth0_id=auth0Id).first()
        if not user:
            user = User(email=email, username=username, auth0_id=auth0Id)
            db.session.add(user)
        else:
            user.email = email
            user.username = username
        db.session.commit()
        return SyncUser(ok=True)
