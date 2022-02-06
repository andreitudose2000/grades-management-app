from app import get_db, app
import sqlite3
import os

def init_db():
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    db = sqlite3.connect(
            os.path.join(app.instance_path, 'flask-app.db'),
            detect_types=sqlite3.PARSE_DECLTYPES
        )
    with app.open_resource('schema.sql') as f:
        x = f.read()
        db.executescript(x.decode('utf8'))

if __name__ == '__main__':
    init_db()