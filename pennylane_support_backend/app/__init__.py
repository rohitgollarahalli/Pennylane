from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from app.extensions import db
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes.main import main_bp
    app.register_blueprint(main_bp)
    from app.routes.graphql import graphql_bp
    app.register_blueprint(graphql_bp, url_prefix="/api")
    from app.models import user
    return app
