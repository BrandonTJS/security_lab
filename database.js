/********************************************************************************/
/*										*/
/*		database.js							*/
/*										*/
/*	Database query methods							*/
/*										*/
/********************************************************************************/

require("dotenv").config()
var adb = require("any-db");


/********************************************************************************/
/*										*/
/*	Initializations 							*/
/*										*/
/********************************************************************************/

var pool = adb.createPool(process.env.DB_CONNECT,{ min : 1, max : 4 });


function sanitize(unclean){
   return mysql_real_escape_string(unclean)
}

/********************************************************************************/
/*										*/
/*	Query function								*/
/*										*/
/********************************************************************************/

function query(q,prms,next)
{
   if (prms instanceof Function) {
      next = prms;
      prms = undefined;
    }

   console.log("DATABASE:",q);

   q = fixQuery(q);

   return pool.query(q,prms,callback(next));
}



function callback(next)
{
   return function(err,data) {
      if (err) console.log("DATABASE ERROR",err);
      else console.log("DATABASE RETURN",data.rows.length);
      if (next != null) next(err,data);
    }
}




/********************************************************************************/
/*										*/
/*	Handle mysql - postgresql differences on parameters			*/
/*										*/
/********************************************************************************/

function fixQuery(q)
{
   if (process.env.DB_CONNECT.substring(0,5) == "mysql") {
      q = q.replace(/\$\d+/g,"?");
    }

   return q;
}


function mysql_real_escape_string (str) {
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
               return "\\"+char; // prepends a backslash to backslash, percent,
                                 // and double/single quotes
       }
   });
}


/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.query = query;
exports.sanitize = sanitize;



/* end of database.js */
