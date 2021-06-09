export default {
  /*
  Global
   */
  onTimerClick({ dispatch, getters, commit, rootState }) {
    const {
      isSessionCreated,
      isPaused,
      isRunning,
      isSessionStartedButPendingProcess,
    } = getters.getTimerState
    if (!isSessionCreated) {
      // in v2 we will let the user the possibility to select a task to be ran
      // the SET_LAUNCH_TIMER_VISIBILITY will have to be removed and called after the user selected a task from the modal
      // commit(
      //   'globalState/SET_CURRENT_MODAL_OPEN',
      //   rootState.globalState.modalsRefs.SELECT_RUNNING_TASK,
      //   { root: true }
      // )
      commit('globalState/SET_LAUNCH_TIMER_VISIBILITY', true, { root: true })
    } else if (isSessionStartedButPendingProcess) {
      dispatch('startCurrentStep')
    } else if (isPaused) {
      dispatch('resumeCurrentStep')
    } else if (isRunning) {
      dispatch('pauseCurrentStep')
    } else {
      // TODO CUSTOM ERROR throw new CustomErrorTimer
    }
  },

  /*
    Session
   */
  async getAndSetCurrentSession({ commit }) {
    const { data } = await this.$axios.get('/api/user/sessions/current')
    if (data.id) {
      commit('SET_CURRENT_SESSION_AND_CURRENT_STEP', data)
    }
  },

  async createAndStartSession({ dispatch, commit }) {
    const { data } = await this.$axios.post('/api/user/sessions')
    try {
      await this.$axios.get(`api/user/sessions/${data.id}/start`)
    } catch (err) {
      dispatch('globalState/handleGeneralApiError', err.response.data.message, {
        root: true,
      })
    } finally {
      commit('globalState/SET_LAUNCH_TIMER_VISIBILITY', false, { root: true })
    }
  },

  /*
   Session actions
   */
  onAbortClick({ dispatch }) {
    const notification = {
      title: this.$t('Abort session ?'),
      description: this.$t('Are you sure to abort the current session ?'),
      actionRequired: true,
      confirmCallback: () => dispatch('abortSession'),
    }
    dispatch('globalState/createNotification', notification, { root: true })
  },

  /*
    Abort
   */
  async abortSession({ dispatch }) {
    const notification = {
      title: this.$t('Session aborted !'),
      description: this.$t('Your current session was successfully aborted'),
    }
    try {
      await this.$axios.get('/api/user/sessions/current/abort')
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      dispatch('globalState/handleGeneralApiError', err.response.data.message, {
        root: true,
      })
    }
  },

  /*
   Skip
  */
  onSkipCurrentStepClick({ dispatch }) {
    const notification = {
      title: this.$t('Skip process ?'),
      description: this.$t('Are you sure to skip the current process ?'),
      type: 'success',
      actionRequired: true,
      confirmCallback: () => dispatch('skipCurrentStep'),
    }
    dispatch('globalState/createNotification', notification, { root: true })
  },
  async skipCurrentStep({ dispatch }) {
    const notification = {
      title: this.$t('Process skipped !'),
      description: this.$t('Your process was successfully skipped'),
    }
    try {
      await this.$axios.post('/api/user/sessions/current/steps/current/skip')
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      dispatch('globalState/handleGeneralApiError', err.response.data.message, {
        root: true,
      })
    }
  },

  /*
    Pause
  */
  async pauseCurrentStep({ dispatch }, payload) {
    const notification = {
      title: this.$t('Session paused !'),
      description: this.$t('Your session was successfully paused'),
    }
    try {
      await this.$axios.post('/api/user/sessions/current/steps/current/pause')
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      dispatch('globalState/handleGeneralApiError', err.response.data.message, {
        root: true,
      })
    }
  },

  /*
    Resume
  */
  async resumeCurrentStep({ dispatch }) {
    const notification = {
      title: this.$t('Session resumed !'),
      description: this.$t('Your session was successfully resumed'),
    }
    try {
      await this.$axios.post('/api/user/sessions/current/steps/current/resume')
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      dispatch('globalState/handleGeneralApiError', err.response.data.message, {
        root: true,
      })
    }
  },

  /*
    Start current step
 */
  startCurrentStep() {
    // TODO axios call
  },
}
