Map Infrastructureparameters = [
      vpcId: 'vpc-6bc66d13',
      DBUser:'notus',
      DBPassword:'VillageandCity',
      DBName:'windInspection',
      LoadBalancerName:'winspectALB',
      Subnets:'subnet-870413dd,subnet-b066e99b',
      HostedZoneId:"",
      RecordSetName:""
      ]      

def output
pipeline {
  agent any
  parameters {
        booleanParam(
          defaultValue: false,
            description: 'Do you want run build step ?',
            name: 'build')
        booleanParam(
          defaultValue: false,
            description: 'Do you want run app-infrastructure step ?',
            name: 'appinfrastructure')
        booleanParam(
          defaultValue: false,
            description: 'Do u want run app ?',
            name: 'application')        
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
       steps {
          sh 'tar -cvf dist.tar dist'
          sh 'tar -cvf express.tar express'
          script{
               def timestamp = new  Date()
               version = timestamp.format("yyyyMMdd.HHmm", TimeZone.getTimeZone('GMT'))
          }
          withAWS(region:'us-west-2') {
          s3Upload(file:'dist.tar', bucket:'centizen-jenkins', path:"builds/winspect/$version/")
          s3Upload(file:'express.tar', bucket:'centizen-jenkins', path:"builds/winspect/$version/")
          }
       }
    }
 
    stage('deploy appinfrastructure') {
       when {
          expression { params.appinfrastructure }
      }
         steps {
         withAWS(region:'us-west-2'){
         cfnUpdate(stack:'winspectApp-Infrastructure',file:"deployment/app_infrastructure.yaml",params: Infrastructureparameters ) 
        }
         } 
         }
    stage('defoutput'){
        steps{
            script{
            output = cfnDescribe(stack:'winspectApp-Infrastructure')
            }
        }
    } 
    stage('appdeploy') {
        when {
                expression { params.application }
            }
         steps {
         withAWS(region:'us-west-2'){
         cfnUpdate(stack:'winspectapp',file:"deployment/application.yaml",params:[
         'AmiId':'ami-005bdb005fb00e791',
         'AutoScalingGroupName':'winspectasg',
         'DesiredCapacity':'1',
         'IamInstanceProfile':"${output.IamInstanceProfile}",
         'InstanceSecurityGroups':"$output.RDSAccessSecurityGroup,$output.ApplicationIngressSecurityGroup,sg-0d7807373f29222fa",
         'KeyName':'capps-tools',
         'LoadBalancerArn':"${output.LoadBalancerName}",
         'MaxBatchSize':1,
         'MaxSize':2,
         'MinInstancesInService':0,
         'MinSize':1,
         'PauseTime':'PT10M',
         'SpotPrice':"",
         'Subnets':'subnet-870413dd,subnet-b066e99b,subnet-c8b0b5b1,subnet-e7eccaac',
         'version':"${version}",
         'VpcId':'vpc-6bc66d13'])
         }
         } 
    }
  }
}