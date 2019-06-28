Map app1deploy = [
      vpcId: 'vpc-6bc66d13',
      DBUser:'sasi',
      DBPassword:'jenwins123',
      Subnets:'subnet-870413dd,subnet-b066e99b',
      LoadBalancerName:'Loadb',
      HostedZoneId:"",
      RecordSetName:"",
      DBName:'MyDataBase'
      
   ]      

def output



pipeline {
  agent any
  parameters {
        booleanParam(
          defaultValue: false,
            description: 'Do you want run build',
            name: 'build')
        booleanParam(
          defaultValue: false,
            description: 'Do u want run app',
            name: 'app')
        booleanParam(
          defaultValue: false,
            description: 'Do u want run app-infra',
            name: 'appinfra')    
             booleanParam(
          defaultValue: false,
            description: 'Do u want run tar and upload',
            name: 'upload')    
    }

  options {
      ansiColor('xterm')
  }
  stages {
    stage('Git clone') {
      steps {
          checkout scm
      }
    }
    stage('Build and Package') {
         when {
                // Only say hello if a "greeting" is requested
                expression { params.build }
            }
      steps {
        withDockerContainer("node:8") {
            sh "npm install"
            // sh "npm run ng test" // This needs chrome and does not work on Jenkins agent
            sh "npm run ng build --prod -aot --build-optimizer"
            sh "cd express && npm install"
        }
      }
    }
    stage('tar and upload') {
     when {
                // Only say hello if a "greeting" is requested
                expression { params.upload }
            }
       steps {
          sh 'tar -cvf dist.tar dist'
          sh 'tar -cvf express.tar express'
          script{
               def timestamp = new  Date()
               version = timestamp.format("yyyyMMdd.HHmm", TimeZone.getTimeZone('GMT'))
          }
          withAWS(region:'us-west-2') {
          s3Upload(file:'dist.tar', bucket:'acc-jens', path:"builds/winspect/$version/")
          s3Upload(file:'express.tar', bucket:'acc-jens', path:"builds/winspect/$version/")
            }
        }
    }
 
stage('deploy infrastructure') {
       when {
                // Only say hello if a "greeting" is requested
                expression { params.appinfra }
            }
         steps {
         withAWS(region:'us-west-2'){
         cfnUpdate(stack:'sasiinfrastructure',file:"app_infrastructure.yaml",params: app1deploy )
         
        
         }
         
    } }
stage('defoutput'){
        steps{
            script{
            output = cfnDescribe(stack:'sasiinfrastructure')
            }
        }
    } 
stage('deploy') {
        when {
                // Only say hello if a "greeting" is requested
                expression { params.app }
            }
         steps {
         withAWS(region:'us-west-2'){
         cfnUpdate(stack:'app',file:"application.yaml",params:[
         'AmiId':'ami-005bdb005fb00e791',
         'DesiredCapacity':'1',
         'KeyName':'key',
         'LoadBalancerArn':"${output.LoadBalancerName}",
         'AutoScalingGroupName':'wins',
         'IamInstanceProfile':"${output.IamInstanceProfile}",
         'InstanceSecurityGroups':"${output.RDSAccessSecurityGroup},${output.ApplicationIngressSecurityGroup}",
    
         'Subnets':'subnet-870413dd,subnet-b066e99b',
         'VpcId':'vpc-6bc66d13',
         'MaxSize':2,
         'MinSize':1,
         'MaxBatchSize':1,
         'MinInstancesInService':0,
         'PauseTime':'PT5M',
         'version':"20190628.0549",  
         'SpotPrice':""
          ])
         }
       }
     }
  

  }
}