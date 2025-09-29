const configBackup = {
	user: 'db_a6478c_prueba_admin',
	password: 'razors1805',
	server: 'sql5079.site4now.net',
	database: 'db_a6478c_prueba',
	pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}
};

const config = {
	user: 'DB_A6478C_mercadosv2_admin',
	password: 'razors1805',
	server: 'sql5060.site4now.net',
	database: 'DB_A6478C_mercadosv2',
	pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}
};


const configX = {
	user: 'sa',
	password: 'aA1',
	server: 'DESKTOP-E0KG096\\SQL17',
	database: 'HOST_MERCADOS',
	pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}
};


const sql = require('mssql');

let execute = {
	Query : (res,sqlqry)=>{	
		
		//console.log('ejecutando consulta... ' + sqlqry);		
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					console.log(err.message);
					res.send('error');
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
				res.send('error');
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
			console.log(error);
		  res.send('error');   
		  sql.close();
		}
	},
	QueryBackup : (res,sqlqry)=>{	
		
		//console.log('ejecutando consulta... ' + sqlqry);		

		try {
		  const pool1 = new sql.ConnectionPool(configBackup, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					//res.send(err.message)
					res.send('error');
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  res.send('error');
			  sql.close();
		  })
		} catch (error) {
		  //res.send('Error al ejecutar la consulta: ' + error) 
		  console.log(error);  
		  res.send('error'); 
		  sql.close();
		}
	},
	QueryNoSend : (res,sqlqry)=>{
		
		//console.log('ejecutando consulta... ');	

		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {				
				if(err){
					res.send(err.message)
				}else{
					res.send('Ejecución exitosa');
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},
	QueryData : (sqlqry)=>{	
		
		return new Promise((resolve,reject)=>{

			try {
				const pool5 = new sql.ConnectionPool(config, err => {
				  new sql.Request(pool5)
				  .query(sqlqry, (err, result) => {
					  if(err){
						  console.log(err.message);
						  reject(err.message);
					  }else{
						  resolve(result);
					  }					
				  })
				  sql.close();  
				})
				pool5.on('error', err => {
					console.log('error sql = ' + err);
					reject(err);
					sql.close();
				})
			  } catch (error) {
				  	console.log(error);
				  	reject(error);   
					sql.close();
			  }

		})	

		
	},
	command : (rsqlqry)=>{			
		return new Promise((resolve,reject)=>{
			try {
				const pool1 = new sql.ConnectionPool(config, err => {
				  new sql.Request(pool1)
				  .query(sqlqry, (err, result) => {
						sql.close();
						if(err){
							reject(err);		  
						}else{
							resolve(result);
						}					
				  })  
				})
				pool1.on('error', err => {
					sql.close();
					reject(err);
				})
			  } catch (error) {
					sql.close();
					reject(error);
			  }
		})
	},
	start:()=>{
		console.log('intentando iniciar la conexión...')
		//const sql = require('mssql')
		try {
			sql.connect(config).then(()=>{sql.close();})
			console.log('primera conexion exitosa...');
		} catch (error) {
			console.log('primera conexion fallo: ' & error);
		}
	}
}

module.exports = execute;

