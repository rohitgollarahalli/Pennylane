from app import db

class Challenge(db.Model):
    __tablename__ = 'challenges'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100))
    difficulty = db.Column(db.String(50))
    points = db.Column(db.Integer)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships (to be added later)
    #hints = db.relationship('Hint', backref='challenge', lazy=True)
    #objectives = db.relationship('LearningObjective', backref='challenge', lazy=True)
    #conversations = db.relationship('Conversation', backref='challenge', lazy=True)
