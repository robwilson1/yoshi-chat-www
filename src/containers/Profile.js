import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import { setProfile, setYotiUser } from '../actions'

function mapStateToProps(state) {
    return {
        profile: state.profile.get('baseProfile')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setProfile: (profile) => dispatch(setProfile(profile)),
        setYotiUser: (ID) => dispatch(setYotiUser(ID))
    }
}

class Profile extends Component {
    static propTypes = {
        profile: PropTypes.object,
        setProfile: PropTypes.func,
        setYotiUser: PropTypes.func   
    }

    constructor() {
        super()
        this.state = { isLoggedIn: false }
    }

    componentDidMount() {
        if (!window.sessionStorage.profile) {
            if (this.props.location.query.token) {
                const token = this.props.location.query.token
                const urlRoot = 'https://yoshi-chat.herokuapp.com/api/profile'

                axios.get(`${urlRoot}?token=${token}`)
                    .then((res) => {
                        const profile = res.data.userProfile
                        const encodedProfile = btoa(JSON.stringify(profile))
                        const yotiUserId = res.data.userId

                        this.props.setProfile(profile)
                        this.props.setYotiUser(yotiUserId)
                        window.sessionStorage.setItem('profile', encodedProfile)
                        window.sessionStorage.setItem('yotiId', yotiUserId)

                        this.setState({ isLoggedIn: true })
                    })
                    .catch((err) => {
                        console.warn('ERROR', err)
                    })
            }
        } else {
            let decodedProfile = JSON.parse(atob(window.sessionStorage.profile))
            this.props.setProfile(decodedProfile)
            this.props.setYotiUser(window.sessionStorage.yotiId)
            this.setState({ isLoggedIn: true })
        }
    }

    render() {
        return (
            <div>
                { this.state.isLoggedIn &&
                    <div>
                        <h3>You have logged in</h3>
                        <Link to="/dashboard">Continue...</Link>
                    </div>
                }

                { !this.state.isLoggedIn &&
                    <div>
                        <h3>Logging you in...</h3>
                        <Link to="/">If nothing happens, click me to go home.</Link>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile)