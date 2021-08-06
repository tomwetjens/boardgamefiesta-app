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

#./stack.sh create dev
#./stack.sh update dev

ACTION=$1-stack
ENV=$2

STACK_NAME=boardgamefiesta-$ENV

echo "${ACTION}: $STACK_NAME"

aws cloudformation $ACTION --stack-name $STACK_NAME-app \
  --template-body file://app.yaml \
  --parameters ParameterKey=Environment,ParameterValue=$ENV
