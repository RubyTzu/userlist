//variable
const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users'

const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
let SearchUsers = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const styleBar = document.querySelector('#style-bar')
const cardStyle = document.querySelector('#card-style')
const lineStyle = document.querySelector('#line-style')
let currentPage = 1;




//function
function switchToCardListPage() {
    cardStyle.classList.add('switch-style-btn-click')
    lineStyle.classList.remove('switch-style-btn-click')
}

function switchToLineListPage() {
    lineStyle.classList.add('switch-style-btn-click')
    cardStyle.classList.remove('switch-style-btn-click')
}

function renderUserCardList(data) {

    rawHTML = ''
    data.forEach(item => {

        rawHTML += `
                <div class="col-auto col-xl-3">
                    <div class="card d-flex flex-column align-items-center mb-3 rounded-5 border border-0 single-card-group">
                        <img src="${item.avatar}"
                            class="user-avatar card-img-top w-75 mt-5 mb-3 border border-warning rounded-circle" alt="user-avatar" data-bs-toggle="modal" data-bs-target="#user-Modal" data-id="${item.id}">
                         <div class="card-body w-100 d-flex justify-content-between">
                            <p class="card-text ps-3 mt-2">${item.name} ${item.surname}</p>
                            <a href="#" class="card-link text-decoration-none fs-3 pe-3 mb-3 mt-0"><i class="fa-solid fa-heart pe-0 favorite-btn" data-id="${item.id}"></i></a>
                        </div>
                    </div>
                </div>
    `
    })

    dataPanel.innerHTML = rawHTML
}


function renderUserLineList(data) {

    let rawHTML = ''

    rawHTML += '<ul class="list-group list-group-flush w-75 mb-3">'

    data.forEach(item => {

        rawHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent py-3">
                <div class="ms-2 me-auto">
                    ${item.name} ${item.surname}
                </div>
                <ul class="d-flex fs-3">
                    <li>
                        <a class="text-decoration-none user-list-btn m-2" href="#"><i class="info-btn fa-solid fa-circle-info" data-bs-toggle="modal" data-bs-target="#user-Modal" data-id="${item.id}"></i></a>
                    </li>
                    <li>
                        <a class="text-decoration-none m-2" href="#"><i class="fa-solid fa-heart favorite-btn" data-id="${item.id}"></i></a>
                    </li>
                </ul>
            </li>
        `
    })

    rawHTML += '</ul >'

    dataPanel.innerHTML = rawHTML

}


function renderPaginator(amount) {

    let numberOfPages = Math.ceil(amount / 12)
    let rawHTML = ''

    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `
    <li class="page-item"><a class="page-link pagination-style rounded-0" href="#" data-page="${page}">${page}</a></li>
    `
    }

    paginator.innerHTML = rawHTML
}


function getUserByPage(page) {

    let pageContent = SearchUsers.length ? SearchUsers : users
    let StartUser = (page - 1) * 12
    return pageContent.slice(StartUser, StartUser + 12)

}

function UserIDtoPage(id) {
    let pageContent = SearchUsers.length ? SearchUsers : users
    let userIndex = pageContent.findIndex(element => element.id === id)
    let currentPage = Math.ceil((userIndex + 1) / 12)

    return currentPage

}



function showUserModal(id) {
    let userName = document.querySelector('#user-modal-name')
    let userId = document.querySelector('#user-modal-id')
    let userGender = document.querySelector('#user-modal-gender')
    let userBirthday = document.querySelector('#user-modal-birthday')
    let userAge = document.querySelector('#user-modal-age')
    let userEmail = document.querySelector('#user-modal-email')
    let userRegion = document.querySelector('#user-modal-region')
    let userAvatar = document.querySelector('#user-modal-avatar')

    axios
        .get(INDEX_URL + '/' + id)
        .then(response => {
            let userData = response.data
            userName.innerText = `${userData.name} ${userData.surname}`
            userId.innerHTML = `<span class="fw-bold">ID</span>   ${userData.id}`
            userGender.innerHTML = `<span class="fw-bold">Gender</span> ${userData.gender}`
            userBirthday.innerHTML = `<span class="fw-bold">Birthday</span> ${userData.birthday}`
            userAge.innerHTML = `<span class="fw-bold">Age</span> ${userData.age}`
            userEmail.innerHTML = `<span class="fw-bold">Email</span> ${userData.email}`
            userRegion.innerHTML = `<span class="fw-bold">Region</span> ${userData.region}`
            userAvatar.innerHTML = `
            <div class="d-flex">
            <img src="${userData.avatar}" class="user-modal-avatar border border-warning rounded-circle bg-warning" alt="">
            </div>
            `
        })

}


function hadFavorite() {
    //Card style list
    if (cardStyle.matches('.switch-style-btn-click')) {


        let CurrentPageUsersNum = dataPanel.childElementCount

        for (let i = 0; i < CurrentPageUsersNum; i++) {

            let chooseBtn = dataPanel.children[i].children[0].children[1].children[1].children[0]

            chooseBtn.classList.add('favorite-btn-click')

        }

    }

    //line style list
    else if (lineStyle.matches('.switch-style-btn-click')) {

        let CurrentPageUsersNum = dataPanel.children[0].childElementCount

        for (let i = 0; i < CurrentPageUsersNum; i++) {

            let chooseBtn = dataPanel.children[0].children[i].children[1].children[1].children[0].children[0]

            chooseBtn.classList.add('favorite-btn-click')

        }

    }



}


function removeFromFavorite(id) {

    let pageContent = SearchUsers.length ? SearchUsers : users
    let removeIndex = pageContent.findIndex(element => element.id === id)

    pageContent.splice(removeIndex, 1)

    localStorage.setItem('favoriteUsers', JSON.stringify(pageContent))
}





//event Listener
dataPanel.addEventListener('click', function onClickedPanel(e) {
    if (e.target.matches('.user-avatar') || e.target.matches('.info-btn')) {
        showUserModal(Number(e.target.dataset.id))
    }

    if (e.target.matches('.favorite-btn') && (e.target.classList.contains('favorite-btn-click'))) {

        e.target.classList.toggle('favorite-btn-click')
        removeFromFavorite(Number(e.target.dataset.id))

        let pageContent = SearchUsers.length ? SearchUsers : users


        renderPaginator(pageContent.length)

        if (cardStyle.matches('.switch-style-btn-click')) {
            renderUserCardList(getUserByPage(currentPage))
        } else if (lineStyle.matches('.switch-style-btn-click')) {
            renderUserLineList(getUserByPage(currentPage))
        }


        hadFavorite()

    }
})


paginator.addEventListener('click', function onClickedPaginator(e) {
    const page = Number(e.target.dataset.page);
    currentPage = page

    if (e.target.matches('.page-link') && cardStyle.matches('.switch-style-btn-click')) {
        renderUserCardList(getUserByPage(page))
    } else if (e.target.matches('.page-link') && lineStyle.matches('.switch-style-btn-click')) {
        renderUserLineList(getUserByPage(page))
    }
    hadFavorite()
})


searchForm.addEventListener('submit', function onSearchForm(e) {

    e.preventDefault()
    const searchValue = searchInput.value.trim().toLowerCase()

    if (!searchValue.length) {
        alert('Please enter valid string!')
    }


    SearchUsers = users.filter(serUser => {
        let serUserName = serUser.name.toLowerCase()
        let serUserSurName = serUser.surname.toLowerCase()

        if (serUserName.includes(searchValue) || serUserSurName.includes(searchValue)) {
            return serUser
        }
    })



    renderPaginator(SearchUsers.length)
    currentPage = 1

    if (cardStyle.matches('.switch-style-btn-click')) {
        renderUserCardList(getUserByPage(currentPage))
    } else if (lineStyle.matches('.switch-style-btn-click')) {
        renderUserLineList(getUserByPage(currentPage))
    }

    hadFavorite()



})

styleBar.addEventListener('click', function onClickedStyleBar(e) {

    if (e.target.matches('#card-style')) {
        switchToCardListPage()
        renderUserCardList(getUserByPage(currentPage))

    } else if (e.target.matches('#line-style')) {
        switchToLineListPage()
        renderUserLineList(getUserByPage(currentPage))
    }

    hadFavorite()

})

//first Render
renderPaginator(users.length)
switchToCardListPage()
renderUserCardList(getUserByPage(currentPage))
hadFavorite()
