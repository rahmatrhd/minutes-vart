export const set_user = (data) => (
  {
    type: 'INPUT_USER',
    payload: {
      username: data.username,
      name: data.name
    }
  }
)