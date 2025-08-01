# app/routes/__init__.py
from flask import Blueprint, request, jsonify
from app.graphql.schema import schema

api = Blueprint("api", __name__)

@api.route("/graphql", methods=["POST"])
def graphql_post():
    data = request.get_json()
    query = data.get("query")
    variables = data.get("variables")
    operation_name = data.get("operationName")

    result = schema.execute(
        query,
        variable_values=variables,
        operation_name=operation_name,
        context_value={"request": request}
    )

    response = {}
    if result.errors:
        response["errors"] = [str(err) for err in result.errors]
    if result.data:
        response["data"] = result.data

    return jsonify(response)
