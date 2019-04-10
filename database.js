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


function conn(){
   return pool
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



/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.query = query;
exports.conn = conn;



/* end of database.js */
