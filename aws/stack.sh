#!/bin/bash

#./stack.sh create dev
#./stack.sh update dev

ACTION=$1-stack
ENV=$2

STACK_NAME=boardgamefiesta-$ENV

echo "${ACTION}: $STACK_NAME"

aws cloudformation $ACTION --stack-name $STACK_NAME-app \
  --template-body file://app.yaml \
  --parameters ParameterKey=Environment,ParameterValue=$ENV
