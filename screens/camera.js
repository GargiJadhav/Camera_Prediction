import * as React from 'react';
import {Button , View , Platform , Stylesheet} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state={
        image:null
    }
    render(){
        let image = this.state
        return(
            <Button title="Pick an Image from Gallery" color="purple" onPress={this.pickImage()}  />
        )
    }
    componentDidMount(){
        this.getPermissionAsync()
    }
    getPermissionAsync = async()=>{
        if(Platform !== "web"){
            const{status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Permissions for accessing Gallery is required !!")
            }
        }
    }
    uploadImage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split("/")[uri.split('.').length-1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
          uri: uri,
          name: filename,
          type: type,
        };
        data.append("digit", fileToUpload);
        fetch("https://f292a3137990.ngrok.io/predict-digit", {
          method: "POST",
          body: data,
          headers: {
            "content-type": "multipart/form-data",
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log("Success:", result);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    }
    pickImage = async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaType:ImagePicker.mediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3]
            })
            if(!result.cancelled){
                this.setState({image:result.data})
                this.uploadImage()
            }
        }
        catch(error){
            console.log(error)
        }
}

    
}