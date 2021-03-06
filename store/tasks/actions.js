import {
  TASK_DELETE_ID_URL,
  TASK_STATUSES_URL,
  TASK_UPDATE_ID_URL,
  TASK_URL,
} from '@/constantes/api'

export default {
  async getAndSetAllTaskStatuses({ commit }) {
    try {
      const { data } = await this.$axios.get(TASK_STATUSES_URL)
      commit('SET_ALL_TASKS_STATUSES', data)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /*
     Create generic
    */
  async addTask({ dispatch, commit }, payload) {
    try {
      const notification = {
        title: this.$i18n.t('Task created!'),
        type: 'success',
        description: this.$i18n.t('A new task was added to your list'),
      }
      await this.$axios.post(TASK_URL, payload)
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      return err.response.data
    }
  },
  /*
     Delete generic
    */
  async deleteTask({ dispatch, commit }, id) {
    try {
      await this.$axios.delete(TASK_DELETE_ID_URL(id))
      const notification = {
        title: this.$i18n.t('Task deleted!'),
        type: 'success',
        description: this.$i18n.t('Your task was successfully deleted'),
      }
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      dispatch(
        'globalState/handleTaskActionServerError',
        err.response.data.message,
        { root: true }
      )
    }
  },

  /*
    Update generic
   */
  async updateTaskGeneric({ dispatch, commit }, payload) {
    try {
      await this.$axios.post(payload.url, payload.data)
      const notification = {
        title: this.$i18n.t('Task edited!'),
        type: 'success',
        description: this.$i18n.t('Your task was successfully edited'),
      }
      dispatch('globalState/createNotification', notification, { root: true })
    } catch (err) {
      dispatch(
        'globalState/handleTaskActionServerError',
        err.response.data.message,
        { root: true }
      )
      commit('globalState/FORCE_RERENDER_TASK_TABLES', null, { root: true })

      return err.response.data
    }
  },

  async updateTaskName({ dispatch, commit }, payload) {
    return await dispatch('updateTaskGeneric', {
      url: TASK_UPDATE_ID_URL(payload.id),
      data: { name: payload.name },
    })
  },

  async updateTaskStatus({ dispatch, commit }, payload) {
    return await dispatch('updateTaskGeneric', {
      url: TASK_UPDATE_ID_URL(payload.id),
      data: { task_status_id: payload.task_status_id },
    })
  },

  async updateTaskDeadline({ dispatch, commit }, payload) {
    return await dispatch('updateTaskGeneric', {
      url: TASK_UPDATE_ID_URL(payload.id),
      data: { deadline: payload.deadline },
    })
  },

  async updateTaskDescription({ dispatch, commit }, payload) {
    return await dispatch('updateTaskGeneric', {
      url: TASK_UPDATE_ID_URL(payload.id),
      data: { description: payload.description },
    })
  },

  /*
    Single tasks related
   */
  async getAndSetAllSingleTasks({ commit }) {
    try {
      const { data } = await this.$axios.get(TASK_URL)
      commit('SET_ALL_SINGLES_TASKS', data)
      commit('SET_ALL_TASKS', data)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  updateSingleTask({ dispatch, commit, getters }, payload) {
    commit('UPDATE_SINGLE_TASK', payload)
  },

  deleteSingleTask({ dispatch, commit, getters }, payload) {
    if (getters.getSinglesCurrentTaskSelected.id === payload.id) {
      commit('RESET_SINGLES_TASKS_CURRENT_TASK_SELECTED_ID')
    } else if (
      getters.getSinglesCurrentArchivedTaskSelected.id === payload.id
    ) {
      commit('RESET_SINGLES_TASKS_CURRENT_ARCHIVED_TASK_SELECTED_ID')
    }

    commit('DELETE_SINGLE_TASK', payload.id)
  },
}
