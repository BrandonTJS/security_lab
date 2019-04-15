*Vulnerability 1*
Description: 
Server crashes when trying to login as admin due to null benefitStartDate values stored in database

Steps to replicate: 
1. Go to login page
2. Login as admin (username: admin, password: Admin_123)

Fix:
//Do a check before executing date conversion code
if (date != undefined){
    var mon = date.getMonth() + 1;
    if (mon < 10) mon = "0"+mon;
    var string = date.getFullYear() + "-" + mon + "-" + ('0' + date.getDate()).slice(-2);
    console.log("CONVERT",date,string);
    data.rows[i].benefitStartDate = string;
} else {
    data.rows[i].benefitStartDate = "Nil";
}

*Vulnerability 2*
Description:
Exposed eval function allowing for attackers to run arbitrary code on server.

Steps to replicate:
1. Go to contributions page
2. In any of the fields, type "res.end(require('fs').readdirSync('.').toString())" (without double quotes)
3. Click submit button

Fix:
//Replace eval with parseFloat
var preTax = parseFloat(req.body.preTax);
var afterTax = parseFloat(req.body.afterTax);
var roth = parseFloat(req.body.roth);

*Vulnerability 3*
Description:
SQL injection vulnerability in profile.js.

Steps to replicate:
1. Go to profile page
2. Fill in all required fields
3. Replace last name field with "test', isAdmin = b'1" (without double quotes)
4. Click submit button

Fix:
//Escape user inputs
var lastname = db.sanitize(req.body.lastName);

where db.sanitize(string) is
return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
        case "\0":
            return "\\0";
        case "\x08":
            return "\\b";
        case "\x09":
            return "\\t";
        case "\x1a":
            return "\\z";
        case "\n":
            return "\\n";
        case "\r":
            return "\\r";
        case "\"":
        case "'":
        case "\\":
        case "%":
            return "\\"+char;
    }
});

*Vulnerability 4*
Description:
Denial-of-Service attack caused by regex validation.

Steps to replicate:
1. Go to profile page
2. Fill in all required fields
3. Replace bank routing field with "91762612117612121123123123123121" (without double quotes)
4. Click submit button

Fix:
//Check for input length before doing regex validation
if (bankRouting.length > 8 || regexPattern.test(bankRouting) !== true) {
    var doc = { updateError: "Bank Routing number does not comply with requirements for format specified" };
    return res.render("profile", doc);
}

*Vulnerability 5*
Description:
XSS vulnerability in memo page

Steps to replicate:
1. Go to memo page
2. Type "<script>alert('alert')</script>" (without double quotes) in the input field.
4. Click submit button

Fix:
//HTML encode input
encodeHTML(req.body.memo)

where encodeHTML(string) is
return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');


Main takeaways
----------------------
1. Even with access to the source code, it is still easy to miss out potential areas of vulnerability.
2. It is critical to have logs as it helps understand how attackers take down the server.
3. Security is not easy. Securing a server is a continous process of constantly patching flaws in the code.
4. I have taken down 7 diffrent machines, multiple times each.
5. My server has been taken down on 5 seperate occassions.
6. There are many ways to take down a server or do some nasty stuff to it.