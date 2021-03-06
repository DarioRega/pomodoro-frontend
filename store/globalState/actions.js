export default {
  async login({ dispatch, rootState, commit }, payload) {
    commit('globalState/SET_REFRESH_LOADING', false, { root: true })

    await this.$auth.loginWith('laravelSanctum', {
      data: payload,
    })
  },

  async logout() {
    sessionStorage.removeItem('is_page_reload')
    await this.$auth.logout()
  },

  async getEnvironment({ dispatch, commit, rootGetters }) {
    await this.$auth.fetchUser()
    this.$initWebSocketChannel('userPrivateChannel', this.$auth.user.id)

    const currentSessionPromise = new Promise((resolve, reject) => {
      dispatch('sessions/getAndSetCurrentSession', null, {
        root: true,
      }).then(() => resolve())
    })

    const tasksPromise = new Promise((resolve, reject) => {
      dispatch('tasks/getAndSetAllSingleTasks', null, {
        root: true,
      }).then(() => resolve())
    })

    const taskStatusesPromise = new Promise((resolve, reject) => {
      dispatch('tasks/getAndSetAllTaskStatuses', null, {
        root: true,
      }).then(() => resolve())
    })

    await Promise.all([
      currentSessionPromise,
      tasksPromise,
      taskStatusesPromise,
    ])

    commit('globalState/SET_ENV_LOADING', false, { root: true })
    commit('globalState/SET_REFRESH_LOADING', false, { root: true })
  },

  handleSessionActionsServerError({ dispatch }) {
    const notification = {
      title: this.$i18n.t('Something went wrong'),
      description: this.$i18n.t(
        'If the error persist, try to abort the current session and restart with a fresh one, or contact our team.'
      ),
      type: 'error',
    }
    dispatch('createNotification', notification)
  },

  handleTaskActionServerError({ dispatch }, errMessage) {
    const notification = {
      title: this.$i18n.t('Something went wrong'),
      description: errMessage,
      type: 'error',
    }
    dispatch('createNotification', notification)
  },

  createNotification({ dispatch, getters, commit, rootState }, payload) {
    let notificationKey = Math.floor(Math.random() * 9999)
    if (payload.notificationId) {
      notificationKey = payload.notificationId
    }

    const confirmCallback =
      typeof payload.confirmCallback === 'function'
        ? payload.confirmCallback
        : null
    const closeCallback = payload.closeCallback ? payload.closeCallback : null
    const selfCloseDispatch = () =>
      dispatch('removeNotification', notificationKey)

    const notification = {
      ...payload,
      type: payload.type ? payload.type : 'info',
      notificationId: notificationKey,
      actionRequired: payload.actionRequired ? payload.actionRequired : false,
      actionText: payload.actionText ? payload.actionText : '',
      closeCallback,
      confirmCallback,
      selfCloseDispatch,
    }

    commit('CREATE_NOTIFICATION', notification)
  },

  removeNotification({ commit }, payload) {
    commit('REMOVE_NOTIFICATION', payload)
  },
}
