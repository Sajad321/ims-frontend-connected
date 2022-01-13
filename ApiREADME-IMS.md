GET `/states`

- Get all states from the database.
- Request Arguments: None
- Returns: list of states.

Example Response `{ 
    "states": [
        {
            "id": 1,
            "name": "منصور صيفي",
        }
    ],
    "total_states": 11,
    "success": true,
}`

POST `/states`

- Add a state to the database.
- Request Body: Name.
- Returns: name of state.

Example Request Payload `{
    "name": "1"
}`

Example Response `{
    "name": "1"
    "success": true
}`

PATCH `/states`

- Edit a state to the database.
- Request Body: Name.
- Returns: name of state.

Example Request Payload `{
    "name": "1"
}`

Example Response `{
    "name": "1"
    "success": true
}`

DELETE `/states/<state_id>`

- Delete a state from the database.
- Request Arguments: None.
- Returns: name of state.

Example Response `{
    "name": "ينمبلا",
    "success": true
}`

GET `/states/{state_id}`

- Get students of state from the database, search by name, sort according to importance.
- Request Arguments: None
- Returns: list of students.

Example Response `{
    "students": [
        {
            "id": 1,
            "name": "1",
            "school": "1",
            "branch": "1",
            "institute": "1",
            "first_phone_number": "1",
            "second_phone_number": "1",
            "poster": "1",
            "code": "1",
            "telegram_username": "1",
            "total_amount": "1",
            "first_installment": "1",
            "second_installment": "1",
            "third_installment": "1",
            "forth_installment": "1",
            "remaining_amount": "1",
            "notes": "1",
        }
    ],
    "total_students": 214,
    "page": 2,
    "success": true
}`

POST `/students`

- Add a student to the database.
- Request Arguments: None.
- Returns: name of student.

Example Request Payload `{
    "name": "1",
    "school": "1",
    "branch": "1",
    "institute": "1",
    "governorate": "1",
    "first_phone_number": "1",
    "second_phone_number": "1",
    "poster_id": "1",
    "code": "1",
    "telegram_username": "1",
    "total_amount": "1",
    "first_installment_amount": "1",
    "first_installment_date": "2010/2/2",
    "first_installment_receipt": "221",
    "second_installment_amount": "1",
    "second_installment_date": "2010/2/2",
    "second_installment_receipt": "221",
    "third_installment_amount": "1",
    "third_installment_date": "2010/2/2",
    "third_installment_receipt": "221",
    "forth_installment_amount": "1",
    "forth_installment_date": "2010/2/2",
    "forth_installment_receipt": "221",
    "remaining_amount": "1",
    "notes": "1",
}`

Example Response `{
    "name": "جبار علي",
    "success": true
}`


PATCH `/students/{student_id}`

- Edit a student to the database.
- Request Arguments: None.
- Returns: name of student.

Example Request Payload `{
    "name": "1",
    "school": "1",
    "branch": "1",
    "institute": "1",
    "governorate": "1",
    "first_phone_number": "1",
    "second_phone_number": "1",
    "poster_id": "1",
    "code": "1",
    "telegram_username": "1",
    "total_amount": "1",
    "first_installment_amount": "1",
    "first_installment_date": "2010/2/2",
    "first_installment_receipt": "221",
    "second_installment_amount": "1",
    "second_installment_date": "2010/2/2",
    "second_installment_receipt": "221",
    "third_installment_amount": "1",
    "third_installment_date": "2010/2/2",
    "third_installment_receipt": "221",
    "forth_installment_amount": "1",
    "forth_installment_date": "2010/2/2",
    "forth_installment_receipt": "221",
    "remaining_amount": "1",
    "notes": "1",
}`

Example Response `{
    "name": "جبار علي",
    "success": true
}`

DELETE `/students/<student_id>`

- Delete a student from the database.
- Request Arguments: None.
- Returns: name of students.

Example Response `{
    "name": "جبار علي",
    "success": true
}`

GET `/reports`

- Get reports of students from the database, search by date of installment and receipt number, sort according to importance.
- Request Arguments: state_id, page, search.
- Returns: list of students.

Example Response `{
    "students": [
        {
            "id": 1,
            "name": "1",
            "school": "1",
            "governorate": "1",
            "institute": "1",
            "poster": "1",
            "code": "1",
            "total_amount": "1",
            "first_installment": "1",
            "second_installment": "1",
            "third_installment": "1",
            "forth_installment": "1",
            "remaining_amount": "1",
            "notes": "1",
        }
    ],
    "total_first_installment": 142,
    "total_second_installment": 2141,
    "total_third_installment": 1424,
    "total_forth_installment": 14421,
    "total_remaining_amount": 4124,
    "total_students": 214,
    "page": 2,
    "success": true
}`

GET `/users`

- Get users from database.
- Request Arguments: None
- Returns: list of students.

Example Response `{
    "users": [
        {
            "id": 1,
            "name": "1",
            "email": "1",
            "authority": [
                {
                    "id": 1,
                    "state": "نرس"
                }
            ],
        }
    ],
    "total_users": 214,
    "success": true
}`

POST `/users`

- Add user in database.
- Request Arguments: None
- Returns: None.

Example Request Payload `{
    "id": 1,
    "name": "1",
    "email": "1",
    "password": "22",
    "authority": [
        {
            "id": 1,
            "state": "نرس"
        }
    ],
}`

Example Response `{
    "success": true
}`

PATCH `/users/{user_id}`

- edit user in database.
- Request Arguments: None
- Returns: list of students.

Example Request Payload `{
    "id": 1,
    "name": "1",
    "email": "1",
    "password": "22",
    "authority": [
        {
            "id": 1,
            "state": "نرس"
        }
    ],
}`

Example Response `{
    "success": true
}`
