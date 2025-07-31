from app import create_app
from app.graphql.schema import schema
from flask_graphql import GraphQLView

app = create_app()

# Add the GraphQL endpoint
app.add_url_rule(
    '/api/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True)
)
