auth.onAuthStateChanged(user => {
    if(user){
        console.log('user is here')

       const nav = document.querySelector('nav');
       nav.style.display = 'flex'
       db.collection('users').doc(user.uid).get().then(snapshot =>{
           document.querySelector('#navName').innerHTML = snapshot.data()['firstName'] + " " + snapshot.data()['lastName'];

       })

       const navImg = document.querySelector('#navImg');
        console.log(navImg.src)
        storage.ref('users/'+user.uid+'/profile.jpg').getDownloadURL().then(imgurl=>{
            navImg.src = imgurl;
        }).catch(err =>{
            console.log(err);
        })
       document.querySelectorAll('.auth').forEach(element =>{
           element.style.display = 'none'
           
    })
    document.querySelector('#navName').addEventListener('click',()=>{
        window.location.href="profile.html"
    })
    document.querySelector('#navImg').addEventListener('click',()=>{
        window.location.href="profile.html"
    })

    }else {
        console.log('no user');
    }
})

// getting signup form
const signupform = document.querySelector('#signup-form');
// adding event 
signupform.addEventListener('submit' , (e)=>{
    e.preventDefault();

    // get user info
    let fname = signupform['signup-fname'].value;
    fname = fname[0].toUpperCase() + fname.substr(1)
    let lname = signupform['signup-lname'].value;
    lname = lname[0].toUpperCase() + lname.substr(1)
    const email = signupform['signup-email'].value;
    const password = signupform['signup-password'].value;
    const gender = signupform['signup-male'].checked == true ? 'male' :'female';
    const age = signupform['signup-age'].value;
    const phone = signupform['signup-phone'].value;
    const type = signupform['signup-volunteer'].checked == true ?'volunteer':'help';



    // signup user
    auth.createUserWithEmailAndPassword(email,password)
    .then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            firstName:fname,
            lastName:lname,
            email:email,
            password:password,
            age:age,
            phone:phone,
            type:type,
            gender:gender,
            bio:'Write something about you'
        });
        
        })
    .then(()=>{
        auth.signOut();
    })
    .then(()=>{
        alert('Successfully Signed Up Please Log In To Proceed!')
        window.location.href="index.html"
    })
    .catch(err=>{
        alert(err.message)
    })
    
})// end of event

    // login
    const login = document.querySelector('#login-form')
    login.addEventListener('submit', e=>{
        e.preventDefault()

        const email = login['email'].value;
        const password = login['password'].value;

        auth.signInWithEmailAndPassword(email,password).then(cred =>{
            console.log(cred)
            window.location.href="profile.html"
        }).catch(error => {
            alert(error.message)
        })
    })



    // logout button
    document.querySelector('#logout').addEventListener('click', e=>{
        auth.signOut().then(()=>{
            alert('See you soon!')
            window.location.href = "index.html"
        })

    })