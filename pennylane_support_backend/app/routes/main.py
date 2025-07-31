from flask import Blueprint, jsonify
from app.auth import requires_auth

main_bp = Blueprint("main", __name__)

@main_bp.route("/api/secure-data", methods=["GET"])
@requires_auth
def secure_data():
    return jsonify(message="This is a protected route.")
