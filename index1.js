const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());
let port = process.env.PORT || 3000

var mysqlConnection = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b58bf8b3fc023e',
    password: '50f9ce96',
    database: 'BMS',
    multipleStatements: true
});


mysqlConnection.connect((err) => {
    if (!err)
        console.log('Database connection succeded.');
    else
        console.log('Database connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all customers
app.get('/customers', (req, res) => {
    mysqlConnection.query('select * from customer_details', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get a particular customer
app.get('/customers/:id', (req, res) => {
    mysqlConnection.query('select * from customer_details WHERE customer_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete a particular customer
app.delete('/customers/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM customer_details WHERE customer_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Customer ', req.params.id, ' deleted successfully.');
        else
            console.log(err);
    })
});

//Insert a customer
app.post('/customers', (req, res) => {
    let cus = req.body;
    var sql = "SET @customer_id = ?;SET @name = ?;SET @branch_id = ?;SET @password = ?;SET @city = ?;SET @phone = ?; SET @cnic = ?;SET @Address = ?;SET @Zip = ?;SET @Email = ?;SET @last_login = ?; \
    CALL CustomersAddOrEdit(@customer_id, @name, @branch_id, @password, @city, @phone, @cnic, @Address, @Zip, @Email, @last_login);";
    mysqlConnection.query(sql, [cus.customer_id, cus.name, cus.branch_id, cus.password, cus.city, cus.phone, cus.cnic, cus.Address, cus.Zip, cus.Email, cus.last_login], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted Customer ID: '+element[0].customer_id);
            });
        else
            console.log(err);
    })
});

//Update a customer
app.put('/customers', (req, res) => {
    let cus = req.body;
    var sql = "SET @customer_id = ?;SET @name = ?;SET @branch_id = ?;SET @password = ?;SET @city = ?;SET @phone = ?; SET @cnic = ?;SET @Address = ?;SET @Zip = ?;SET @Email = ?;SET @last_login = ?; \
    CALL CustomersAddOrEdit(@customer_id, @name, @branch_id, @password, @city, @phone, @cnic, @Address, @Zip, @Email, @last_login);";
    mysqlConnection.query(sql, [cus.customer_id, cus.name, cus.branch_id, cus.password, cus.city, cus.phone, cus.cnic, cus.Address, cus.Zip, cus.Email, cus.last_login], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});

//Get all admins
app.get('/admins', (req, res) => {
    mysqlConnection.query('select * from admin', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get a particular admin
app.get('/admins/:id', (req, res) => {
    mysqlConnection.query('select * from admin WHERE admin_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete a particular admin
app.delete('/admins/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM admin WHERE admin_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Admin ', req.params.id, ' deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an admin
app.post('/admins', (req, res) => {
    let adm = req.body;
    var sql = "SET @cmd = ?; SET @admin_id = ?;SET @name = ?;SET @admin_branch = ?; SET @salary = ?; SET @phone = ?; SET @last_login = ?; \
    CALL AdminsAddOrEdit(@cmd, @admin_id, @name, @admin_branch, @salary, @phone, @last_login);";
    mysqlConnection.query(sql, [adm.cmd, adm.admin_id, adm.name, adm.admin_branch, adm.salary, adm.phone, adm.last_login], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted Admin ID: '+element[0].admin_id);
            });
        else
            console.log(err);
    })
});

//Update an admin
app.put('/admins', (req, res) => {
    let adm = req.body;
    var sql = "SET @cmd = ?; SET @admin_id = ?;SET @name = ?;SET @admin_branch = ?; SET @salary = ?; SET @phone = ?; SET @last_login = ?; \
    CALL AdminsAddOrEdit(@cmd, @admin_id, @name, @admin_branch, @salary, @phone, @last_login);";
    mysqlConnection.query(sql, [adm.cmd, adm.admin_id, adm.name, adm.admin_branch, adm.salary, adm.phone, adm.last_login], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});


//update a user
app.get('/edituser:id',(req, res)=>{
    let usr = req.body;
    let query = ""
    for (var i = 0; i < usr.upd.length; i++) {
        if (i%2==1){
            query+='=\`'
        }
        query += usr.upd[i]
        if (i%2==1){
            query+='\`'
            if (i!=usr.upd.length - 1){
            query+=' AND '
        } 
        }
        
    }
    var sql = `UPDATE customer_details SET \'${query}\' WHERE customer_id = \'${usr.customer_id}\'`;
    mysqlConnection.query(sql, (err, res) => {
        if (!err)
            res.send(JSON.stringify("Update customer = " + usr.customer_id))
        else
            console.log(err);
    })
})

//login
app.post('/login',(req, res)=>{
    let usr = req.body;
    mysqlConnection.query(`SELECT * FROM customer_details WHERE Email = ? AND password = ?`, [usr.Email, usr.password], (err, rows, fields) => {
        if (!err)
            res.send(rows);
            
        else
            console.log(err);
    }) 
})
//

//Amount
app.get('/amount/:id', (req, res) => {
    mysqlConnection.query('select balance from account_details WHERE account_number = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(JSON.stringify(rows));
        else
            console.log(err);
    })
});

//Update Account and Transactions table for withdraw and deposit
app.put('/account', (req, res) => {
    let cus = req.body;
    var sql = "SET @cmd = ?; SET @account_number = ?; SET @receiver_account = ?; SET @balance = ?; SET @amount = ?; \
    CALL BalanceUpdate(@cmd, @account_number,@receiver_account, @balance, @amount);";
    mysqlConnection.query(sql, [cus.cmd, cus.account_number, cus.receiver_account, cus.balance, cus.amount], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});

//Update Account and Transactions table for transfer
app.put('/transfer', (req, res) => {
    let cus = req.body;
    var sql = "SET @sender_account = ?; SET @receiver_account = ?; SET @sender_balance = ?; SET @receiver_balance = ?; SET @amount = ?; \
    CALL Transfer(@sender_account, @receiver_account, @sender_balance, @receiver_balance, @amount);";
    mysqlConnection.query(sql, [cus.sender_account, cus.receiver_account, cus.sender_balance, cus.receiver_balance, cus.amount], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});

//Insert a customer into Pending table
app.post('/pending', (req, res) => {
    let cus = req.body;
    var sql = "SET @customer_id = ?;SET @name = ?;SET @branch_id = ?;SET @password = ?;SET @city = ?;SET @phone = ?; SET @cnic = ?;SET @Address = ?;SET @Zip = ?;SET @Email = ?; \
    CALL PendingAddOrEdit(@customer_id, @name, @branch_id, @password, @city, @phone, @cnic, @Address, @Zip, @Email);";
    mysqlConnection.query(sql, [cus.customer_id, cus.name, cus.branch_id, cus.password, cus.city, cus.phone, cus.cnic, cus.Address, cus.Zip, cus.Email], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted Customer ID: '+element[0].customer_id);
            });
        else
            console.log(err);
    })
});

//Get all pending customers
app.get('/pending', (req, res) => {
    mysqlConnection.query('select * from pending_approval', (err, rows, fields) => {
        if (!err)
            res.send(JSON.stringify(rows));
        else
            console.log(err);
    })
});

//Approve/Deny a pending customer
app.put('/pending', (req, res) => {
    let cus = req.body;
    var sql = "SET @cmd = ?;SET @customer_id = ?; \
    CALL PendingApprove(@cmd, @customer_id);";
    mysqlConnection.query(sql, [cus.cmd, cus.customer_id], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});

//Get all transactions
app.get('/transactions', (req, res) => {
    mysqlConnection.query('select * from transactions', (err, rows, fields) => {
        if (!err)
            res.send(JSON.stringify(rows));
        else
            console.log(err);
    })
});

//Get all transactions
app.get('/accounts', (req, res) => {
    mysqlConnection.query('select t1.customer_id, t1.name, t1.branch_id, t1.Email,  t1.password, t1.city, t1.phone, t1.cnic, t1.Address, t1.Zip,  t1.last_login, t2.balance, t2.cc_number, t2.account_type, t2.date_of_opening, t2.loan_id, t2.last_trans FROM customer_details as t1 left JOIN account_details as t2 on customer_id = account_number', (err, rows, fields) => {
        if (!err)
            res.send(JSON.stringify(rows));
        else
            console.log(err);
    })
});

//Request Loans
app.put('/loans', (req, res) => {
    let cus = req.body;
    var sql = "SET @customer_id = ?;SET @interest = ?;SET @amount = ?;SET @name = ?; SET @branch_id = ?; SET @cnic = ?; SET @Email = ?;\
    CALL LoansAdd(@customer_id, @interest, @amount, @name, @branch_id, @cnic, @Email);";
    mysqlConnection.query(sql, [cus.customer_id, cus.interest, cus.amount, cus.name, cus.branch_id, cus.cnic, cus.Email], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});

//Get all pending  that want loan
app.get('/loans', (req, res) => {
    mysqlConnection.query('select * from loan_pending', (err, rows, fields) => {
        if (!err)
            res.send(JSON.stringify(rows));
        else
            console.log(err);
    })
});

//Approve/Deny a pending loan
app.post('/loans', (req, res) => {
    let cus = req.body;
    var sql = "SET @cmd = ?;SET @customer_id = ?; \
    CALL LoanApprove(@cmd, @customer_id);";
    mysqlConnection.query(sql, [cus.cmd, cus.customer_id], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully.');
        else
            console.log(err);
    })
});




