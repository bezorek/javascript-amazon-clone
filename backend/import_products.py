import json
import psycopg2

# Connection conf
conn = psycopg2.connect(
    dbname="database",
    user="postgres",
    password="admin", # Stupido
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# JSON file
with open("backend/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

for product in products:
    id = product["id"]
    name = product["name"]
    price = product["priceCents"] / 100
    image = product.get("image")
    stars = product.get("rating", {}).get("stars")
    quantity = product.get("rating", {}).get("count")
    keywords = product.get("keywords", [])

    cur.execute("""
        INSERT INTO product (id, name, price, image, stars, quantity, keywords)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
    """, (id, name, price, image, stars, quantity, keywords))

conn.commit()
cur.close()
conn.close()
print("✔ Done")
