SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 1;
START TRANSACTION;
SET time_zone = "+05:00";

 -- drop database bms;

 -- drop database if exists bms;
 -- create database bms;

use bms;

CREATE TABLE if not exists branch_details(
    branch_id int, 
	name VARCHAR(50) NOT NULL,
	city VARCHAR(50) NOT NULL,
	customers VARCHAR(50) NOT NULL,
	employees_id int NOT NULL,
	admin_id int NOT NULL,
    primary key(branch_id),
    unique (admin_id),
    unique (name)
);
use bms;
drop table customer_details;
CREATE TABLE if not exists customer_details(
    customer_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    branch_id INT,
    password VARCHAR(50) NOT NULL default '0000',
    city VARCHAR(50) NOT NULL,
    phone double NOT NULL,
    cnic INT NOT NULL,
    Address varchar(100) not null default 'Address Not Given',
    Zip int not null default 00000,
    Email varchar(60) not null default 'Email Not Given',
    last_login datetime default NULL, -- Another option but unnecessary DEFAULT current_timestamp,
    primary key(customer_id),
    foreign key (branch_id) references branch_details(branch_id)
);
alter table customer_details modify customer_id int not null auto_increment, auto_increment=100000000;

use bms;
CREATE TABLE if not exists pending_approval(
    customer_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    branch_id INT,
    password VARCHAR(50) NOT NULL default '0000',
    city VARCHAR(50) NOT NULL,
    phone double NOT NULL,
    cnic INT NOT NULL,
    Address varchar(100) not null default 'Address Not Given',
    Zip int not null default 00000,
    Email varchar(60) not null default 'Email Not Given',
    primary key(customer_id),
    foreign key (branch_id) references branch_details(branch_id)
);
alter table pending_approval modify customer_id int not null auto_increment, auto_increment=1;

CREATE TABLE if not exists loan_pending(
    loan_id int not null,
    account_number int,
	interest varchar(50) not null,
    amount int not null,
    name VARCHAR(50) NOT NULL,
    branch_id INT,
    cnic int not null, 
    Email varchar(60) not null,
    primary key(loan_id)
);
alter table loan_pending modify loan_id int not null auto_increment, auto_increment=1;

CREATE TABLE if not exists admin(
    admin_id int NOT NULL,
	name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL default '0000',
	admin_branch VARCHAR(50) NOT NULL,
	salary double NOT NULL,
	phone double NOT NULL,
	last_login datetime default NULL,
    primary key(admin_id),
    foreign key (admin_id) references branch_details(admin_id),
    foreign key (admin_branch) references branch_details(name)
);
-- alter table admin modify admin_id int not null auto_increment, auto_increment=1;
drop table transactions;
CREATE TABLE if not exists transactions(
    trans_id int not null,
	trans_type VARCHAR(50) NOT NULL default 'Default', 
	sender_account int not null default 0,
	receiver_account int not null default 0,
	amount int not null default 0,
	trans_date datetime NOT NULL DEFAULT current_timestamp,
    primary key(trans_id)
);
alter table transactions modify trans_id int not null auto_increment, auto_increment=1;
/*INSERT INTO transactions(trans_id)
		VALUES (0);*/

drop table employees;
CREATE TABLE if not exists employees(
    employee_id int not null,
	name VARCHAR(50) NOT NULL,
	contact VARCHAR(50) NOT NULL,
	cnic int not null,
	salary int not null,
	last_login datetime default null,
	last_trans int not null,
    primary key(employee_id),
    foreign key (last_trans) references transactions(trans_id)
);

CREATE TABLE if not exists loan(
    loan_id int not null,
    account_number int,
	interest varchar(50) not null,
    amount int not null,
	duration int not null,
	installments_remaining int not null,
	next_install datetime default null,
	loan_processed datetime default current_timestamp,
    primary key(loan_id)
);
alter table loan change payment_plan interest varchar(50) not null;
alter table account_details drop column loan_id_num;
alter table account_details ADD loan_id int;
alter table account_details add foreign key(loan_id) references loan(loan_id);
alter table account_details modify loan_id int not null;
alter table loan modify loan_processed datetime default current_timestamp;
/*INSERT INTO loan(loan_id,amount,interest, duration, installments_remaining , next_install, loan_processed )
		VALUES (0, 0, 0, 0, 0, NULL, NULL);*/
-- use bms;
drop table account_details;
CREATE TABLE if not exists account_details(
    account_number int not null,
	balance int not null default 0,
	cc_number int not null default 0,
	account_type VARCHAR(50) NOT NULL default "Default",
	date_of_opening datetime NOT NULL DEFAULT current_timestamp,
	loan_id int default 0,
	last_trans int default 0,
    primary key(account_number),
    foreign key (account_number) references customer_details(customer_id),
    foreign key (loan_id) references loan(loan_id),
    foreign key (last_trans) references transactions(trans_id)
);


 /* insert into branch_details (branch_id,name,city, customers, employees_id, admin_id)
 VALUES
    (  420, 'Meezan', 'Lahore', 454, 1100, 1110),
    (  544, 'HBL', 'Islamabad', 1645, 4500, 4510);
 
 insert into customer_details (branch_id,name,city, phone, cnic)
 VALUES
    (420, 'Ayan', 'Lahore', 3204048800, 454545),
    (420,  'Ahmad','Lahore', 3214048800,9898),
    (420,  'Tom', 'Lahore', 44568978,78545),
    (544,  'Jake', 'Karachi', 748596321,74585);
    
 insert into admin (name,admin_branch, phone, salary, last_login)
 VALUES
    (420, 'Ayan', 'Lahore', 3204048800, 454545),
    (420,  'Ahmad','Lahore', 3214048800,9898),
    (420,  'Tom', 'Lahore', 44568978,78545),
    (544,  'Jake', 'Karachi', 748596321,74585);

   
 select * from customer_details;
 select * from branch_details;*/
-- SHOW FULL COLUMNS FROM branch_details;
-- SHOW FULL COLUMNS FROM admin;
-- show tables;

-- show create table customer_details;
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';
-- flush privileges;
commit;

/*CREATE PROCEDURE `CustomersAddOrEdit`(
IN _customer_id INT,
IN _name VARCHAR(50),
IN _branch_id INT,
IN _city VARCHAR(50),
IN _phone double,
IN _cnic INT,
IN _last_login datetime
)

BEGIN
	IF _customer_id = 0 THEN
		INSERT INTO customer_details(branch_id,name,city, phone, cnic, last_login)
		VALUES (_branch_id, _name, _city, _phone, _cnic, _last_login);

	ELSE
		UPDATE customer_details
		SET
		name = _name,
        branch_id = _branch_id,
        city = _city,
        phone = _phone,
        cnic = _cnic,
        last_login = _last_login
		WHERE customer_id = _customer_id;
	END IF;

	SELECT _customer_id as 'customer_id';
END*/

