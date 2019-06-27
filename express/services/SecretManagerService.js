// Load the AWS SDK
require('dotenv').config();
var AWS = require('aws-sdk');
var conf = require('../config/config.js');

function getSecretValue(keyName) {
    return new Promise((resolve, reject) => {
        var secretName = keyName,
            secret;

        //Setting AWS configuration.
        configureAWS();

        // Create a Secrets Manager client
        var client = new AWS.SecretsManager({});
        client.getSecretValue({ SecretId: secretName }, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                if ('SecretString' in data) {
                    secret = data.SecretString;
                    resolve(JSON.parse(secret));
                } else {
                    reject('Key data not found.');
                }
                
            }
        });
    });
}

function configureAWS(){
    AWS.config = new AWS.Config();
    // Access key of the user
    //AWS.config.accessKeyId = CONFIG.access_key;  
    // Secret access key of the user
    //AWS.config.secretAccessKey = CONFIG.secret_access_key; 
    // Region of aws
    AWS.config.region = CONFIG.region;  
}

//Getting mysql configuration from secret manager
function setMysqlConfig(){
    return new Promise(async(resolve,reject)=>{
        getSecretValue(CONFIG.aws_mysql_conf_key).then((configs)=>{
            CONFIG.db_dialect = configs.DB_DIALECT || 'mysql';
            CONFIG.db_host = configs.DB_HOST || 'localhost';
            CONFIG.db_port = configs.DB_PORT || '3306';
            CONFIG.db_name = configs.DB_NAME || 'windInspection';
            CONFIG.db_user = configs.DB_USER || 'notus';
            CONFIG.db_password = configs.DB_PASSWORD || 'VillageandCity';
            resolve('SUCCESS');
        }).catch((error)=>{
            console.log('MySql key does not exists.Using default config.');
            resolve('SUCCESS');
        });
    });
}

//Getting mailserver configuration from secret manager
function setMailServerConfig(){
    return new Promise(async(resolve,reject)=>{
        getSecretValue(CONFIG.aws_mailserver_conf_key).then((configs)=>{
            CONFIG.mail_server = configs.SERVER;
            CONFIG.mail_server_port = configs.PORT;
            CONFIG.mail_server_username = configs.USERNAME;
            CONFIG.mail_server_password = configs.PASSWORD;
            resolve('SUCCESS');
        }).catch((error)=>{
            console.log('Mail server does not exists.Using default key.');
            resolve('SUCCESS');
        });
    });
}

//Getting JWT configuration from secret manager
function setJWTConfig(){
    return new Promise(async(resolve,reject)=>{
        getSecretValue(CONFIG.aws_jwt_conf_key).then((configs)=>{
            CONFIG.jwt_encryption = configs.JWT_ENCRYPTION || 'please_change';
            CONFIG.jwt_expiration = configs.JWT_EXPIRATION || '10000';
            resolve('SUCCESS');
        }).catch((error)=>{
            console.log('JWT key does not exists.Using default config.');
            resolve('SUCCESS');
        });
    });
}

async function setConfiguration(){
    return new Promise(async (resolve,reject)=>{
        try{
            if(CONFIG.app !== 'local'){
                await setMysqlConfig();
                await setMailServerConfig();
                await setJWTConfig();
                resolve('SUCCESS');
            }
            else{
                resolve('SUCCESS');
            }
        }
        catch(Exception){
            reject('Error occurred while fetching secret key.');
        }
    });
}

module.exports = {
    setConfiguration : setConfiguration
}