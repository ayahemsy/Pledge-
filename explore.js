
auth.onAuthStateChanged(user=>{
    if(!user) {
        alert('Please Login to continue!')
        window.location.href="index.html"

    }else{
        
        const userId = user.uid

        // nav bar
        // image
        const navImg = document.querySelector('#navImg');
        storage.ref('users/'+userId+'/profile.jpg').getDownloadURL().then(imgurl=>{
            navImg.src = imgurl;
        }).catch(err =>{
            console.log( 'no user img');
        })
        // hold
        // getting signed in user info
        let authuser;
        db.collection('users').doc(userId).get().then((snapshot)=>{
            authuser = snapshot.data()
        }).then(()=>{document.querySelector('#navName').innerHTML = `${authuser['firstName']} ${authuser['lastName']}`})

        
        // LOGOUT BUTTON
        document.querySelector('#logout').addEventListener("click", e=>{
            auth.signOut().then(function() {
                
                window.location.href="index.html"
                
              }).catch(function(error) {
                console.log(error)
              });
        })

        // Writing post and uploading to fire store
        const postForm = document.querySelector('#post-form');


        postForm.addEventListener('submit',e=>{
            e.preventDefault();
            // getting form values
            const formtxt =  postForm['post-text'].value[0].toUpperCase() + postForm['post-text'].value.substr(1) 
            const formcity =  postForm['post-city'].value[0].toUpperCase() + postForm['post-city'].value.substr(1) 
            const formarea =  postForm['post-area'].value[0].toUpperCase() + postForm['post-area'].value.substr(1) 
            const formdtfrom = postForm['post-dt-from'].value;
            const formdtto = postForm['post-dt-to'].value;
            const formserv = postForm['post-serv'].value;
            // getting user values
            const formfullName = `${authuser['firstName']} ${authuser['lastName']}`;
            const formmail = authuser['email'];
            const formphone = authuser['phone'];

            db.collection('posts').doc(userId).set({
                txt:formtxt,
                city:formcity,
                area:formarea,
                service:formserv,
                dateFrom:formdtfrom,
                dateTo:formdtto,
                fullName:formfullName,
                mail:formmail,
                phone:formphone,
                type:authuser['type'] // getting type *******
                
            }).then(()=>{
                alert('Post Uploaded Successfully');
                window.location.href="explore.html";
            }).catch((err)=>{
                console.log('error' ,err);
            })
            
        })


            // Loading posts from
            db.collection('posts').get().then(snapshot=>{
                snapshot.forEach(post =>{
                    let postImgSRC = './images/iconfinder_user_male2_172626 1.png';
                    storage.ref('users/'+post.id+'/profile.jpg').getDownloadURL().then(imgurl=>{
                        postImgSRC = imgurl;}).catch(()=>{
                            console.log('user has no img')
                        }).then(()=>{
                            console.log(postImgSRC)
                            let typerender = post.data()['type'] == 'volunteer' ?
                            `
                            <div class = "type"><p>Volunteer</p></div>
                            `
                            :"";
                            let renderPost = 
                                                        `
                                                        <div class="container post" id="${post.id}">
                                    <div class="post-header">
                                        <img src="${postImgSRC}" alt="">
                                        <h3>${post.data()['fullName']}</h3>
                                        <div class="userType">
                                            ${typerender}
                                        </div>
                                    </div>
                                    <div class="post-body">
                                        <div>
                                        <span>Service:</span><b>${post.data()['service']?post.data()['service']: ''}</b> 
                                        <div>
                                        <span>From:</span><b>${post.data()['dateFrom']?post.data()['dateFrom'].substr(0,10) +" "+ post.data()['dateFrom'].substr(11) : " "}</b> 
                                        <br>
                                        <span style="margin-right:1.3rem">To:</span><b>${post.data()['dateTo']?post.data()['dateTo'].substr(0,10) +" " + post.data()['dateTo'].substr(11) : " "}</b>
                                        </div>
                                        <span>City:</span><b>${post.data()['city'] }</b> 
                                        <span>Region:</span><b>${post.data()['area']}</b>
                                        </div>
                                        <div style="padding:3rem 0; ">
                                        <p>${post.data()['txt']}</p>
                                        </div>
                                        <button class="btn btn-primary contact ">Contact</button>
                                    </div>
                                    
                                    <div class="post-footer">
                                        
                                        <div class="contact-info">
                                        <h5>Contact info:</h5>
                                        <div>
                                        <a href="https://api.whatsapp.com/send?phone=2${post.data()['phone']}&text=i%20want%20to%20contact%20you"><img src="images/whatsapp logo.png" alt="whatsapp" style="width: 50px;"><span>${post.data()['phone']}</span></a>
                                        </div>
                                        <div>
                                        <a href="tel:${post.data()['phone']}"> <img src="images/call.png" alt="call" style="width: 40px;"><span>${post.data()['phone']}</span></a>
                                        </div>
                                        <div>
                                            <a href="mailto:${post.data()['mail']}"> <img src="images/mail.png" alt="whatsapp" style="width: 30px;"><span>${post.data()['mail']}</span></a>
                                        </div>
                                        </div>
                                    </div>
                                    </div>        
                                                        
                            `


                            // document.querySelectorAll('.type p').forEach(element =>{
                            //    console.log( element.parentElement.parentElement.parentElement.parentElement);
                            // })
                            document.querySelector('.posts').innerHTML+=renderPost
                            document.querySelectorAll('.contact').forEach(btn =>{
                                btn.addEventListener('click' ,e=>{
                                    e.target.parentElement.nextElementSibling.style.display = 'flex';
                                })
                            })
                        


                        }).then(()=>{

                            // document.querySelectorAll('.type p').forEach(element =>{
                            //      element.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                            //  })
                        })
                })
            })























    }

})

    document.querySelectorAll('.contact').forEach(btn =>{
        btn.addEventListener('click' ,e=>{
            e.target.parentElement.nextElementSibling.style.display = 'flex';
        })
    })

    document.querySelector('#navImg').addEventListener('click',e =>{
        window.location.href="profile.html"
    })
    document.querySelector('#navName').addEventListener('click',e =>{
        window.location.href="profile.html"
    })

    // filter stuff
    
    function displayAll () {
            
        document.querySelectorAll('.post').forEach(post=>{
            post.style.display = 'flex'
        })
    }


    function vol () {
        document.querySelectorAll('.post').forEach(post=>{
            post.style.display = 'none'
        })
        document.querySelectorAll('.type p').forEach(element =>{
            element.parentElement.parentElement.parentElement.parentElement.style.display = 'flex';
        })
       
        
    }
    
    function help  (){
        document.querySelectorAll('.post').forEach(post=>{
            post.style.display = 'flex'
        })
        document.querySelectorAll('.type p').forEach(element =>{
            element.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        })
    }