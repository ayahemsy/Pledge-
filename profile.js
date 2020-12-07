// photo stuff
let file = {};
function choseFile(event) {
    file = event.target.files[0]
    console.log(file)
}

auth.onAuthStateChanged(user => {
    if(!user){
        if (confirm("Please login to continue") == true) {
            window.location.href="index.html"
        } else {
            window.location.href="index.html"

        }
    }else {
        // change page title
        var userId = user.uid;
        // getting fields
        
        const fullName = document.querySelector('#fullName');
        const email = document.querySelector('#email');
        const phone = document.querySelector('#phone');
        const type = document.querySelector('#type');
        const gender = document.querySelector('#gender');
        const age = document.querySelector('#age')
        const bio = document.querySelector('#bio');
        console.log(fullName,type,email,phone,gender,age,bio);
        // change prof pic
        var profileImage =  document.querySelector('#profileImage');
        storage.ref('users/'+userId+'/profile.jpg').getDownloadURL().then(imgurl=>{
            profileImage.src = imgurl;
        }).catch(err =>{
            console.log(err);
        })
        

        
        // getting data from db
        
        
        db.collection('users').doc(userId).get().then((snapshot)=>{
            var dt = new Date();

            fullName.innerHTML = snapshot.data()['firstName'] +" "+ snapshot.data()['lastName'];
            type.innerHTML =`${snapshot.data()['type'] == 'volunteer'?"<strong>volunteer</strong>":''} `;
            email.innerHTML =   `<div>${snapshot.data()['email']}</div>`;
            phone.innerHTML = snapshot.data()['phone'];
            age.innerHTML =  snapshot.data()['age'].length>3? dt.getFullYear() - Number(snapshot.data()['age'].substr(0,4)) :snapshot.data()['age'];
            gender.innerHTML = snapshot.data()['gender'];
            bio.innerHTML = snapshot.data()['bio']?snapshot.data()['bio']:'Write something about you'
            // change page title
            document.querySelector('title').innerHTML = `${snapshot.data()['firstName']} ${snapshot.data()['lastName']} | Pledge`
            
        })
        
        // Change photo stuff 
        document.querySelector('#changePhotoForm').addEventListener('submit',e=>{
            e.preventDefault();
            document.querySelector('.prog').style.display = 'flex';
            storage.ref('users/' + userId + '/profile.jpg').put(file)
            .then(()=>{

                alert('Successfully Uploaded!');
                window.location.href="profile.html"
                
            }).catch(err => {
                console.log(err)
            })
            
            
        })
        

        // Logout
        document.querySelector('#logout').addEventListener("click", e=>{
            auth.signOut().then(function() {
                window.location.href="index.html"

                // Sign-out successful.
              }).catch(function(error) {
                console.log(error)
              });
        })

        

        

        
        // explore button
        document.querySelector('#explore').addEventListener('click', e=>{
            window.location.href="explore.html"

        })

        // edit phone number
        const editPhoneForm = document.querySelector('#editPhoneForm');

        editPhoneForm.addEventListener('submit' , e=>{
            e.preventDefault();
            let newPhone = editPhoneForm['number'].value
            db.collection('users').doc(userId).update({phone:newPhone})
            .then(()=>{
                alert('Successfully changed!');
                window.location.href="profile.html"
            })
            .catch((err)=>{
                alert(err.message);
            })
        })

        // Edit bio stuff 

        const changebioform = document.querySelector('#editbioForm');
        changebioform.addEventListener('submit' , e=>{
            e.preventDefault();
            let newBio = changebioform['newBio'].value;
            db.collection('users').doc(userId).update({bio:newBio})
            .then(()=>{
                alert('Successfully changed!');
                window.location.href="profile.html"
            })
            .catch((err)=>{
                alert(err.message);
            })
        })
        

        
        

        
        
        

        

        

        
        

        

        
        
        
        


        
        
    }
})


    