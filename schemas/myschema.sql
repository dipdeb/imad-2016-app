--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: n_article_id_seq; Type: SEQUENCE; Schema: public; Owner: fnwfoyclgxyabc
--

CREATE SEQUENCE n_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_article_id_seq OWNER TO fnwfoyclgxyabc;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: n_article; Type: TABLE; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

CREATE TABLE n_article (
    id integer DEFAULT nextval('n_article_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    heading text NOT NULL,
    date date NOT NULL,
    content text NOT NULL
);


ALTER TABLE n_article OWNER TO fnwfoyclgxyabc;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: fnwfoyclgxyabc
--

CREATE SEQUENCE comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE comment_id_seq OWNER TO fnwfoyclgxyabc;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

CREATE TABLE comment (
    id integer DEFAULT nextval('comment_id_seq'::regclass) NOT NULL,
    n_article_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE comment OWNER TO fnwfoyclgxyabc;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: fnwfoyclgxyabc
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO fnwfoyclgxyabc;

--
-- Name: user; Type: TABLE; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

CREATE TABLE "user" (
    id integer DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE "user" OWNER TO fnwfoyclgxyabc;


CREATE TABLE visitors (
	footfall bigint
);

ALTER TABLE visitors OWNER TO fnwfoyclgxyabc;

--
-- Data for Name: n_article; Type: TABLE DATA; Schema: public; Owner: fnwfoyclgxyabc
--

COPY n_article (id, user_id, title, heading, date, content) FROM stdin;
2	1	Nodejs	Introduction to Node.js	2016-11-07	<p>\r\n                Node.js is an open-source, cross-platform JavaScript runtime environment for developing a diverse variety of tools and applications. Although Node.js is not a JavaScript framework,[3] many of its basic modules are written in JavaScript, and developers can write new modules in JavaScript. The runtime environment interprets JavaScript using Google's V8 JavaScript engine.\r\n\r\n                Node.js has an event-driven architecture capable of asynchronous I/O. These design choices aim to optimize throughput and scalability in Web applications with many input/output operations, as well as for real-time Web applications (e.g., real-time communication programs and browser games).\r\n                The Node.js distributed development project, governed by the Node.js Foundation,[5] is facilitated by the Linux Foundation's Collaborative Projects program.\r\n            </p>
3	1	RDBMS	Relational Database management system	2016-11-07	<p>\r\n                A relational database management system (RDBMS) is a database management system (DBMS) that is based on the relational model as invented by E. F. Codd, of IBM's San Jose Research Laboratory. In 2016, many of the databases in widespread use are based on the relational database model.\r\n\r\nRDBMSs have been a common choice for the storage of information in new databases used for financial records, manufacturing and logistical information, personnel data, and other applications since the 1980s. Relational databases have often replaced legacy hierarchical databases and network databases because they are easier to understand and use. However, relational databases have received unsuccessful challenge attempts by object database management systems in the 1980s and 1990s (which were introduced trying to address the so-called object-relational impedance mismatch between relational databases and object-oriented application programs) and also by XML database management systems in the 1990s. Despite such attempts, RDBMSs keep most of the market share, which has also grown over the years.\r\n          </p>
4	1	Adminer	Adminer	2016-11-07	<p>\r\n              Adminer (formerly phpMinAdmin) is a full-featured database management tool written in PHP. Conversely to phpMyAdmin, it consist of a single file ready to deploy to the target server. Adminer is available for MySQL, PostgreSQL, SQLite, MS SQL, Oracle, SimpleDB, Elasticsearch and MongoDB.\r\n          </p>
5	1	Express js	Express js	2016-11-07	<p>Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. </p>
6	1	body-parser	body-parser	2016-11-07	<p>The bodyParser object exposes various factories to create middlewares. All middlewares will populate the req.body property with the parsed body, or an empty object ({}) if there was no body to parse (or an error was returned).</p>
7	1	PostgeSQL	PostgeSQL	2016-11-07	<p>PostgreSQL, often simply Postgres, is an object-relational database (ORDBMS) – i.e. a RDBMS, with additional (optional use) "object" features – with an emphasis on extensibility and standards-compliance. As a database server, its primary function is to store data securely, and to allow for retrieval at the request of other software applications. It can handle workloads ranging from small single-machine applications to large Internet-facing applications (or for data warehousing) with many concurrent users; on macOS, PostgreSQL is the default database – for web hosting[10][11][12] – and it is also available for Microsoft Windows and Linux (supplied in most distributions).</p>
1	1	Webapp	An Introduction to Webapp	2016-11-07	<p>\r\n                The general distinction between an interactive web site of any kind and a "web application" is unclear. Web sites most likely to be referred to as "web applications" are those which have similar functionality to a desktop software application, or to a mobile app. HTML5 introduced explicit language support for making applications that are loaded as web pages, but can store data locally and continue to function while offline.\r\n\r\n            There are several ways of targeting mobile devices:\r\n\r\n                <ul>\r\n                    <li>Responsive web design can be used to make a web application - whether a conventional web site or a single-page application viewable on small screens and work well with touchscreens.</li>\r\n                    <li>Native apps or "mobile apps" run directly on a mobile device, just as a conventional software application runs directly on a desktop computer, without a web browser (and potentially without the need for Internet connectivity); these are typically written in Java (for Android devices) or Objective C or Swift (for iOS devices). Recently, frameworks like React Native and Flutter have come around, allowing the development of native apps for both platforms using languages other than the standard native languages.</li>\r\n                    <li>Hybrid apps embed a mobile web site inside a native app, possibly using a hybrid framework like Apache Cordova and Ionic or Appcelerator Titanium. This allows development using web technologies (and possibly directly copying code from an existing mobile web site) while also retaining certain advantages of native apps (e.g. direct access to device hardware, offline operation, app store visibility).</li>\r\n                </ul>\r\n            </p>    
\.


--
-- Name: n_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fnwfoyclgxyabc
--

SELECT pg_catalog.setval('n_article_id_seq', 7, true);


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: fnwfoyclgxyabc
--

COPY comment (id, n_article_id, user_id, comment, "timestamp") FROM stdin;
\.


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fnwfoyclgxyabc
--

SELECT pg_catalog.setval('comment_id_seq', 1, false);


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: fnwfoyclgxyabc
--

COPY "user" (id, username, password) FROM stdin;
1	fnwfoyclgxyabc	pbkdf2$10000$6b15f4c84aaae53c494016ac0f1222fe6acaed516c9e865adb590464a6c3fa9d3935538b691fe420fb79fde8a6bcadb1500264e754f8a4eaa7fe0dee5f2e104f03d909ffaad4fc3aa84a6f9f3e5ba27daf637689fda4092755d1bda086725e8e9ebb16aade206ae2a8ded262782e19c4ae793f0140889ed823d673ee93471ee6$74447cbb69e6f6605fed7be8d6156b6e42aff7f81479140dc8c56068fbb17f9c0999bb5c18e9e83c4b5217a0bc83049a542f5424103aa1b0124857c26e472dbfaf90f84da980cea766054751e861bffb808d9513151ae6887bb31b5b621488bfabea7fe915f2512120bdb791cbdcc13defe0482533489a0e739558ef3ae2e857e9ae7e7fa2a5794215e83eb1a4d6d4cae8e31a6abe5f3f4b654ee813d42bfad4b69beb191fa7329dae9f038e91be5773555a343d91d33dd881eeda7ca356a97506e993a2d422cb95e253824ba182fe1fecd25e6136a2f4431a75e43308f48d79e879885b06ccfeab0842421825a60be609e3789f408564f156aca38d07843b3a22b2e38aeacbb946daf390777806cd54405ede54c61a4ada0b61e197838e470238aa074dc2a7760cd9357542a01525aa7325a228a214613d43519a4d47f8b48ff4775d8abf29ee92ccb3302b8429772496195640da1f4b404ca4cb3179d7c1c793e82e8fd6130d396b55f0c0e83e006b149d82eebeaa29bf6db9fa5da21c41fec8c154ebc01513ba9236fccaf09b82cfd40c38ab79912c831f267844c8b2c364cabd6c9572b266195467eaeae876cf97906eaacb052ac51f729ae3098673f3e17f5242562f96955315f7032edaa3ea3831894292ef95e60ac2acdf817f2eab351994549a0780aebda5da2f3ae0d2b1d1ce23d72cc78e2821f2eae6efc3281442
\.


COPY visitors (footfall) FROM stdin;
0
\.

--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fnwfoyclgxyabc
--

SELECT pg_catalog.setval('user_id_seq', 1, true);


--
-- Name: n_article_id; Type: CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

ALTER TABLE ONLY n_article
    ADD CONSTRAINT n_article_id PRIMARY KEY (id);


--
-- Name: n_article_title; Type: CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

ALTER TABLE ONLY n_article
    ADD CONSTRAINT n_article_title UNIQUE (title);


--
-- Name: comment_id; Type: CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT comment_id PRIMARY KEY (id);


--
-- Name: user_id; Type: CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- Name: user_username; Type: CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_username UNIQUE (username);


--
-- Name: n_article_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc
--

ALTER TABLE ONLY n_article
    ADD CONSTRAINT n_article_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id);


--
-- Name: comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fnwfoyclgxyabc
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: fnwfoyclgxyabc
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM fnwfoyclgxyabc;
GRANT ALL ON SCHEMA public TO fnwfoyclgxyabc;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

