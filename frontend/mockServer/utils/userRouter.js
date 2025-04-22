const express = require('express')
const userRouter = express.Router()
const fs = require('fs')
const path = require('path')
const users = require('./users.json')

userRouter.get('/me', (req, res) => {

  const cases = ['success', 'user_not_found']

  const flag = 'success'



  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "id": "05c66d71-10a5-44ce-ba0f-8fd52b41a8c9",
      "firstName": "Saad",
      "lastName": "Aboulhoda",
      "username": "Aboulhoda42",
      "email": "saad@aboulhoda.me",
      "bio": "I love coding",
      "avatarUrl": "https://i.pravatar.cc/150?img=12",
      "preferences": "Software Development,Sport",
      "birthDate": "1970-01-01",
      "balance": 0,
      "networking": 120,
      "networked": 365,
      "createdAt": "2025-04-08T14:22:47.646847",
      "updatedAt": "2025-04-08T14:22:47.646847"
    }
  }

  const res_false = {
    "flag": false,
    "code": 404,
    "message": "The user was not found",
    "data": null
  }


  if (flag == 'success') return res.status(200).json(res_true)
  return res.status(404).json(res_false)
})


userRouter.get('/profile/:username', (req, res) => {
  const cases = ['success', 'user_not_found']

  const flag = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "id": "cffab4dc-493c-48a5-b65f-5ce634b7281c",
      "firstName": "John",
      "lastName": "Wick",
      "username": "JohnWick",
      "bio": "John Wick",
      "networking": 60,
      "networked": 865,
      "avatarUrl": "https://i.pravatar.cc/150?img=13"
    }
  }

  const res_false = {
    "flag": false,
    "code": 404,
    "message": "The user's profile was not found",
    "data": null
  }


  if (flag == 'success') return res.status(200).json(res_true)

  return res.status(404).json(res_false)
})





userRouter.get('/:userId/networking', (req, res) => {

  const cases = ['success', 'invalid_id']
  const flag = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "content": [
        {
          "id": "cffab4dc-493c-48a5-b65f-5ce634b7281c",
          "firstName": "Alice",
          "lastName": "Johnson",
          "username": "AliceJ",
          "bio": "Coffee enthusiast and coder.",
          "networking": 82,
          "networked": 569,
          "avatarUrl": "https://i.pravatar.cc/150?img=14"
        },
        {
          "id": "6c5cc244-efba-4811-9fa2-2208a8e1e937",
          "firstName": "John",
          "lastName": "Wick",
          "username": "JohnWick",
          "bio": "John Wick",
          "networking": 60,
          "networked": 865,
          "avatarUrl": "https://i.pravatar.cc/150?img=15"
        }
      ],
      "pageable": {
        "pageNumber": 0,
        "pageSize": 2,
        "sort": {
          "empty": false,
          "sorted": true,
          "unsorted": false
        },
        "offset": 0,
        "paged": true,
        "unpaged": false
      },
      "totalPages": 1,
      "totalElements": 2,
      "last": true,
      "size": 2,
      "number": 0,
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "numberOfElements": 2,
      "first": true,
      "empty": false
    }
  }
  const res_false = {
    "flag": false,
    "code": 400,
    "message": "Invalid user id",

  }

  if (flag == 'success') return res.status(200).json(res_true)
  return res.status(500).json(res_false)



})

userRouter.get('/:userId/networked', (req, res) => {
  const cases = ['success', 'invalid_id']

  const flag = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "content": [
        {
          "id": "cffab4dc-493c-48a5-b65f-5ce634b7281c",
          "firstName": "Alice",
          "lastName": "Johnson",
          "username": "AliceJ",
          "bio": "Coffee enthusiast and coder.",
          "networking": 82,
          "networked": 569,
          "avatarUrl": "https://i.pravatar.cc/150?img=16"
        },
        {
          "id": "6c5cc244-efba-4811-9fa2-2208a8e1e937",
          "firstName": "John",
          "lastName": "Wick",
          "username": "JohnWick",
          "bio": "John Wick",
          "networking": 60,
          "networked": 865,
          "avatarUrl": "https://i.pravatar.cc/150?img=17"
        }
      ],
      "pageable": {
        "pageNumber": 0,
        "pageSize": 2,
        "sort": {
          "empty": false,
          "sorted": true,
          "unsorted": false
        },
        "offset": 0,
        "paged": true,
        "unpaged": false
      },
      "totalPages": 1,
      "totalElements": 2,
      "last": true,
      "size": 2,
      "number": 0,
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "numberOfElements": 2,
      "first": true,
      "empty": false
    }
  }
  const res_false = {
    "flag": false,
    "code": 400,
    "message": "Invalid user id",
    "data": null

  }

  if (flag) return res.status(200).json(res_true)
  return res.status(500).json(res_false)
})


userRouter.post('/search', (req, res) => {
  const flag = true
  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "content": [
        {
          "id": "cffab4dc-493c-48a5-b65f-5ce634b7281c",
          "firstName": "Alice",
          "lastName": "Johnson",
          "username": "AliceJ",
          "bio": "Coffee enthusiast and coder.",
          "networking": 82,
          "networked": 569,
          "avatarUrl": "https://i.pravatar.cc/150?img=18"
        },
        {
          "id": "6c5cc244-efba-4811-9fa2-2208a8e1e937",
          "firstName": "John",
          "lastName": "Wick",
          "username": "JohnWick",
          "bio": "John Wick",
          "networking": 60,
          "networked": 865,
          "avatarUrl": "https://i.pravatar.cc/150?img=18"
        }
      ],
      "pageable": {
        "pageNumber": 0,
        "pageSize": 2,
        "sort": {
          "empty": false,
          "sorted": true,
          "unsorted": false
        },
        "offset": 0,
        "paged": true,
        "unpaged": false
      },
      "totalPages": 1,
      "totalElements": 2,
      "last": true,
      "size": 2,
      "number": 0,
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "numberOfElements": 2,
      "first": true,
      "empty": false
    }
  }

  if (flag) return res.status(200).json(res_true)
})


userRouter.post('/networks/:userId', (req, res) => {
  const cases = ['success', 'not_found', 'self_connect']
  const msg = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "id": "05c66d71-10a5-44ce-ba0f-8fd52b41a8c9",
      "firstName": "Saad",
      "lastName": "Aboulhoda",
      "username": "Aboulhoda42",
      "email": "saad@aboulhoda.me",
      "bio": "I love coding",
      "avatarUrl": "https://i.pravatar.cc/150?img=19",
      "preferences": "Software Development,Sport",
      "birthDate": "1970-01-01",
      "balance": 0,
      "networking": 120,
      "networked": 365,
      "createdAt": "2025-04-08T14:22:47.646847",
      "updatedAt": "2025-04-08T14:22:47.646847"
    }
  }
  const res_404 = {
    "flag": false,
    "code": 404,
    "message": "Couldn't find the user",
    "data": null
  }

  const res_422 = {
    "flag": false,
    "code": 422,
    "message": "You can't connect with your self",
    "data": null
  }


  if (msg === 'success') return res.status(200).json(res_true)
  if (msg === 'not_found') return res.status(404).json(res_404)
  if (msg === 'self_connect') return res.status(422).json(res_422)

})

userRouter.delete('/networks/:userId', (req, res) => {
  const cases = ['success', 'not_found', 'self_disconnect']
  const msg = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": null
  }

  const res_404 = {
    "flag": false,
    "code": 404,
    "message": "Couldn't find the user",
    "data": null
  }

  const res_422 = {
    "flag": false,
    "code": 422,
    "message": "You can't disconnect with your self",
    "data": null
  }

  if (msg === 'success') return res.status(200).json(res_true)
  if (msg === 'not_found') return res.status(404).json(res_404)
  if (msg === 'self_disconnect') return res.status(422).json(res_422)



})

userRouter.put('/update', (req, res) => {
  const cases = ['success', 'user_not_found']
  const flag = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "id": "05c66d71-10a5-44ce-ba0f-8fd52b41a8c9",
      "firstName": "Saad",
      "lastName": "Aboulhoda",
      "username": "Aboulhoda42",
      "email": "saad@aboulhoda.me",
      "bio": "I love coding",
      "avatarUrl": "https://i.pravatar.cc/150?img=20",
      "preferences": "Software Development,Sport",
      "birthDate": "1970-01-01",
      "balance": 0,
      "networking": 120,
      "networked": 365,
      "createdAt": "2025-04-08T14:22:47.646847",
      "updatedAt": "2025-04-08T14:22:47.646847"
    }
  }


  const res_false = {
    "flag": false,
    "code": 404,
    "message": "The user was not found",
    "data": null
  }

  if (flag == 'success') return res.status(200).json(res_true)
  return res.status(404).json(res_false)

})

userRouter.put('/update/avatar', (req, res) => {
  const cases = ['success', 'file_size_exceed', 'max_upload_exceed']
  const flag = 'success'

  const res_true = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": {
      "avatarUrl": "https://i.pravatar.cc/150?img=21"
    }
  }
  const res_false_file_size_exceed = {
    "flag": false,
    "code": 400,
    "message": "Provided arguments are invalid, see data for details",
    "data": {
      "file": "Image size can not be greater than 2MB"
    }
  }

  const res_false_max_upload_exceed =
  {
    "flag": false,
    "code": 413,
    "message": "Maximun upload size excedded",
    "data": null
  }


  if (flag == 'success') return res.status(200).json(res_true)
  if (flag == 'file_size_exceed') return res.status(400).json(res_false_file_size_exceed)
  if (flag == 'max_upload_exceed') return res.statsu(413).json(res_false_max_upload_exceed)

})


userRouter.put('/update/password', (req, res) => {
  const cases = ['success', 'old_pass_incorrect', 'password_mismatch']

  const flag = 'success'
  const res_success = {
    "flag": true,
    "code": 200,
    "message": "Success",
    "data": null
  }

  const res_old_pass_incorrect = {
    "flag": false,
    "code": 422,
    "message": "The old password is not correct",
    "data": null
  }

  const res_passwords_mismatch = {
    "flag": false,
    "code": 422,
    "message": "The new password and the confirm password don't match",
    "data": null
  }

  if (flag == 'success') return res.status(200).json(res_success)
  if (flag == 'old_pass_incorrect') return res.status(422).json(res_old_pass_incorrect)
  if (flag == 'password_mismatch') return res.status(422).json(res_passwords_mismatch)


})



module.exports = userRouter