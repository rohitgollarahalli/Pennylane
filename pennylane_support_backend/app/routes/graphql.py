from flask import Blueprint
from flask_graphql import GraphQLView
from app.graphql.schema import schema  

graphql_bp = Blueprint("graphql", __name__)

graphql_bp.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        "graphql_view",
        schema=schema,
        graphiql=True
    )
)
