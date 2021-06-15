import _ from 'lodash'

export default {
  getUser: (state, getters, rootState) => {
    return rootState.auth.user
  },
  getIsUserSettings24hTimeFormatDisplay: (state, getters, rootState) => {
    return rootState.auth.user.user_settings.time_display_format === '24H'
  },
  getUserSettingTimezone: (state) => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  },
  getUserSettingsValues: (state, getters, rootState) => {
    return rootState.auth.user.user_settings
  },
  getUserAllPomodoroSettingsValues: (state, getters, rootState) => {
    if (rootState.auth.user.pomodoro_session_settings.length > 0) {
      return rootState.auth.user.pomodoro_session_settings
    }
    return []
  },
  getUserPomodoroSettingsValues: (state, getters, rootState) => {
    return rootState.auth.user.user_settings.pomodoro_session_setting
  },
  areUserSettingsEmpty: (state, getters, rootState) => {
    if (rootState.auth.user.user_settings) {
      return _.isEmpty(rootState.auth.user.user_settings)
    }
    return true
  },
  arePomodoroSettingsEmpty: (state, getters, rootState) => {
    if (rootState.auth.user.pomodoro_session_setting) {
      return false
    }
    return true
  },
  isPomodoroSettingsIdNull: (state, getters, rootState) => {
    if (rootState.auth.user.pomodoro_session_setting_id) {
      return false
    }
    return true
  },
  isAppMuted(state, getters, rootState) {
    return false
  },
}
