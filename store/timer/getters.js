import { STEPS_STATUS } from '@/constantes'
import { getOnlyHoursAndMinutes } from '@/helpers/sessions'

export default {
  getCurrentTimer: (state, getters, rootState, rootGetters) => {
    if (rootGetters['sessions/hasCurrentSession']) {
      if (
        rootState.sessions.current.current_step.status.includes(
          STEPS_STATUS.PAUSED
        )
      ) {
        return getOnlyHoursAndMinutes(
          rootState.sessions.current.current_step.resting_time
        )
      }
    }
    return state.currentTimer
  },
}
