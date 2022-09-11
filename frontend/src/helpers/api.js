import { collection, query, where, doc, getDoc, getDocs, addDoc, updateDoc, orderBy, deleteDoc, limit } from "firebase/firestore";
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";

export const fetch = async (uid = '', filterMonth = null) =>
{
    let q;
    if (filterMonth)
    {
        q = query(collection(db, "diaries"),
            where("uid", "==", uid),
            where("createdAt", ">=", filterMonth + "-01 00:00:00"),
            where("createdAt", "<=", filterMonth + "-31 23:59:59"),
            orderBy("createdAt", "desc"),
            limit(31));
    } else
    {
        const currentMonth = dayjs().format("YYYY-MM")
        q = query(collection(db, "diaries"),
            where("uid", "==", uid),
            where("createdAt", ">=", currentMonth + "-01 00:00:00"),
            where("createdAt", "<=", filterMonth + "-31 23:59:59"),
            orderBy("createdAt", "desc"));
    }


    const querySnapshot = await getDocs(q);
    let diaries = [];
    querySnapshot.forEach((doc) =>
    {
        // doc.data() is never undefined for query doc snapshots
        diaries.push({
            id: doc.id,
            body: doc.data().body,
            rate: doc.data().rate,
            image: doc.data().image,
            createdAt: doc.data().createdAt
        })
    });
    return diaries;
}

// Add a new document with a generated id.
export const postDiary = async (uid = '', body = '', rate = 1, image = null) =>
{
    let uploadResult = await uploadImage(image)
    const docRef = await addDoc(collection(db, "diaries"), {
        uid: uid,
        rate: rate,
        body: body,
        image: uploadResult,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    return docRef.id ? true : false;
}

export const getDiary = async (id = 'dummy') =>
{
    if (id == "dummy") return false;
    const docRef = doc(db, "diaries", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
    {
        return docSnap.data();
    } else
    {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return false;
    }
}

export const updateDiary = async (id = 'dummy', body = '', rate = 1, image = '') =>
{
    let uploadResult = await uploadImage(image)

    const diaryRef = doc(db, "diaries", id);

    if (!diaryRef) { return false; }

    let updateData;
    if (image.name)
    {
        updateData = {
            body: body,
            rate: rate,
            image: uploadResult,
        }
    } else
    {
        updateData = {
            body: body,
            rate: rate,
        }
    }

    await updateDoc(diaryRef, updateData);

    return true;
}

const uploadImage = async (image) =>
{
    let uploadResult = '';
    if (image)
    {
        const ext = image.name.split('.').pop();
        // 画像ファイル名を固定しておく
        const hashName = Math.random().toString(36).slice(-8);
        const uploadRef = ref(storage, `images/${hashName}.${ext}`);
        await uploadBytes(uploadRef, image).then(async (result) =>
        {
            await getDownloadURL(uploadRef).then((url) =>
            {
                uploadResult = url;
            })
        })
    }
    return uploadResult;
}

export const deleteDiary = async (id) =>
{
    if (!id) { return false; }
    await deleteDoc(doc(db, "diaries", id))
    return true;
}