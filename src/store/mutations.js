export default {
  setUserInfo (state, info) {
    let jsonInfo = JSON.parse(info.info)
    state.USER_INFO.name = jsonInfo.name
    state.USER_INFO.gender = jsonInfo.gender
    state.USER_INFO.bio = jsonInfo.bio
    state.USER_INFO.avatar = jsonInfo.avatar
    state.USER_INFO.score = jsonInfo.score
    state.USER_INFO._id = jsonInfo._id
  }
}
