export default {
  SET_CURRENT_SESSION_AND_CURRENT_STEP(state, payload) {
    Object.assign(state, { current: payload })
  },
}
