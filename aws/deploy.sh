#!/bin/bash

#
# Board Game Fiesta
# Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

#./deploy.sh dev
#./deploy.sh prod

ENV=$1

STACK_PREFIX=boardgamefiesta-$ENV

echo "Deploying $ENV"

aws cloudformation deploy --stack-name $STACK_PREFIX-webapp \
  --template-file app.yaml \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides Environment=$ENV

BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name boardgamefiesta-dev-webapp --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)

echo $BUCKET_NAME

aws s3 sync ../dist/boardgamefiesta-app s3://$BUCKET_NAME
