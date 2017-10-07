export const set_user = (data) => (
  {
    type: 'INPUT_USER',
    payload: {
      id: data.id,
      username: data.username,
      email: data.email
    }
  }
)