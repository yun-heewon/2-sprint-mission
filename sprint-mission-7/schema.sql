-- users 테이블 생성
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT password_length CHECK (LENGTH(password)>= 8)
);

-- products 테이블 생성
CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description VARCHAR(300), 
	price INT NOT NULL,
	like_count INT DEFAULT 0,
	image_url TEXT,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT description_length CHECK(LENGTH(description)>= 10),
	CONSTRAINT name_length CHECK(LENGTH(name)<= 10)
);

-- product_comments 테이블 생성
CREATE TABLE product_comments (
	id SERIAL PRIMARY KEY,
	content VARCHAR(200) NOT NULL,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- product_likes 테이블 생성
CREATE TABLE product_likes (
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT unique_product_like UNIQUE (product_id, user_id)
);

-- tags 테이블 생성
CREATE TABLE tags (
	id SERIAL PRIMARY KEY,
	name VARCHAR(5) UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- product_tags 테이블 생성
CREATE TABLE product_tags (
	id SERIAL PRIMARY KEY,
	tag_id INT NOT NULL REFERENCES tags(id),
	product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	CONSTRAINT unique_product_tag UNIQUE (product_id, tag_id)
);

-- articles 테이블 생성
CREATE TABLE articles (
	id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	content VARCHAR(300) NOT NULL,
	like_count INT DEFAULT 0,
	image_url TEXT,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- article_comments 테이블 생성
CREATE TABLE article_comments (
	id SERIAL PRIMARY KEY,
	content VARCHAR(200) NOT NULL,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	article_id INT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--article_likes 테이블 생성
CREATE TABLE article_likes (
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	article_id INT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT unique_article_like UNIQUE (article_id, user_id)
);


-- product 좋아요 시 like count 추가 
CREATE OR REPLACE FUNCTION increment_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET like_count = like_count + 1
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_product_like
AFTER INSERT ON product_likes
FOR EACH ROW
EXECUTE FUNCTION increment_product_like_count();

-- product 좋아요 제거 시 like count 감소
CREATE OR REPLACE FUNCTION decrement_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET like_count = like_count - 1
  WHERE id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_product_like
AFTER DELETE ON product_likes
FOR EACH ROW
EXECUTE FUNCTION decrement_product_like_count();

-- article 좋아요 시 like count 추가 
CREATE OR REPLACE FUNCTION increment_article_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles
  SET like_count = like_count + 1
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_article_like
AFTER INSERT ON article_likes
FOR EACH ROW
EXECUTE FUNCTION increment_article_like_count();

-- article 좋아요 제거 시 like count 감소
CREATE OR REPLACE FUNCTION decrement_article_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles
  SET like_count = like_count - 1
  WHERE id = OLD.article_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_article_like
AFTER DELETE ON article_likes
FOR EACH ROW
EXECUTE FUNCTION decrement_article_like_count();
