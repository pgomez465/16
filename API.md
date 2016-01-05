Messages from Server to Client:
- Initial Data ({self}, [{friends}]) - Sent when the user first logs in, either on initial load or on login
- User Edited ({user}) - Can be any user identified by an ID, either the client or a friend
- Friend Added ({user})
- Chat (message: string)

Messages from Client to Server:
- Added Friend (username: string)
- Removed Friend (user_id)
- Edited Info ({user})
- Chat (message: string)
