#!/bin/bash

API_URL="http://tse.info.uqam.ca/api"
TOKEN=""

# Test 0: Hello from backend
response2=$(curl -s "${API_URL}/")
if [ "${response2}" != "Hello from backend" ]; then
  echo -e "Test 0: Hello from backend \033[0;31mfailed\033[0m"
  exit 1
fi
echo -e "Test 0: Hello from backend \033[0;32mpassed\033[0m"

# Assumes user already exists
# Test 1: Authenticate user
auth_data='{"username":"hacker","password":"veryH@rdPasswed"}'
response4=$(curl -s -X POST -H "Content-Type: application/json" -d "${auth_data}" "${API_URL}/auth")
TOKEN=$(echo "${response4}" | jq -r '.token')
if [ -z "${TOKEN}" ] || [ "${TOKEN}" == "{\"error\":\"Invalid credentials\"}" ]; then
  echo -e "Test 1: Authenticate user \033[0;31mfailed\033[0m"
  exit 1
fi
echo -e "Test 1: Authenticate user \033[0;32mpassed\033[0m"

# Test 3: Get user data
expected_output='{"user":{"username":"hacker","email":"hack@hackers.com","name":"hakouna matata","age":null,"height":null,"weight":null,"sex":null,"description":null}}'
get_response=$(curl -s -X GET -H "Authorization: Bearer ${TOKEN}" "${API_URL}/user")

if [[ "${get_response}" == "${expected_output}" ]]; then
  echo -e "Test 3: Get user data \033[0;32mpassed\033[0m"
else
  echo -e "Test 3: Get user data \033[0;31mfailed\033[0m"
  exit 1
fi

# Test 4: Delete user
user_id=$(echo "${get_response}" | jq -r '.user.userId')
delete_response=$(curl -s -X DELETE -H "Authorization: Bearer ${TOKEN}" "${API_URL}/user")
if [ "${delete_response}" != "{\"message\":\"User successfully deleted\"}" ]; then
  echo -e "Test 4: Delete user \033[0;31mfailed\033[0m"
  exit 1
fi
echo -e "Test 4: Delete user \033[0;32mpassed\033[0m"


# Test 5: Create user
user_data='{"username":"hacker","password":"veryH@rdPasswed","email":"hack@hackers.com","name":"hakouna matata"}'
response3=$(curl -s -X POST -H "Content-Type: application/json" -d "${user_data}" "${API_URL}/user/create")
if [ "${response3}" != "{\"message\":\"user added succesfully\"}" ]; then
  echo "Test 5: Create user \033[0;31mfailed\033[0m"
  exit 1
fi
echo -e "Test 5: Create user \033[0;32mpassed\033[0m"

# Test 6: TODO update user
