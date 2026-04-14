from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['tuneturtle']  # Assuming DB name
users = db['users']

artists = list(users.find({"role": "ARTIST"}))
print(f"Found {len(artists)} artists:")
for a in artists:
    print(a)

