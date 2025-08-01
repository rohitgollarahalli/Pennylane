from flask import Flask, request, jsonify
from flask_cors import CORS
from app.extensions import db, migrate
from app.graphql.schema import schema
from app.cli import register_cli

def create_app():
    app = Flask(__name__)
    app.config.from_object("config")

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/graphql": {"origins": "http://localhost:3000"},
                         r"/api/graphql": {"origins": "http://localhost:3000"}},
         supports_credentials=True)

    register_cli(app)

    # Register models to SQLAlchemy
    from app.models import user, challenge, support
    from app.routes import api
    app.register_blueprint(api, url_prefix="/api")

    # ✅ GraphQL endpoint handling both POST & OPTIONS correctly
    @app.route("/graphql", methods=["POST", "OPTIONS"])
    def graphql_server():
        if request.method == "OPTIONS":
            return '', 200  # preflight safe response

        data = request.get_json()
        result = schema.execute(
            data.get("query"),
            variable_values=data.get("variables"),
            context_value={"session": db.session},
        )
        response = {}
        if result.errors:
            response["errors"] = [str(e) for e in result.errors]
        if result.data:
            response["data"] = result.data
        return jsonify(response)

    return app
