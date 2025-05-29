import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:map/Map";
import { phash; thash } "mo:map/Map";// Assuming phash and thash are correctly defined/imported for Map
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Option "mo:base/Option";
import LLM "mo:llm"; // Import for LLM functionalities

persistent actor Filevault {

  // --- LLM Functionality ---

  // Function to send a single prompt to the LLM
  public shared(msg) func promptLlm(promptText : Text) : async Text {
    // #Llama3_1_8B is a variant representing the specific LLM model
    await LLM.prompt(#Llama3_1_8B, promptText);
  };

  // Function to have a chat session with the LLM
  public shared(msg) func chatLlm(messages : [LLM.ChatMessage]) : async Text {
    // #Llama3_1_8B is a variant representing the specific LLM model
    await LLM.chat(#Llama3_1_8B, messages);
  };

  // --- File Storage Functionality ---

  // Define a data type for a file's chunks.
  type FileChunk = {
    chunk : Blob;
    index : Nat;
  };

  // Define a data type for a file's data.
  type File = {
    name : Text;
    chunks : [FileChunk]; // Array of file chunks
    totalSize : Nat;
    fileType : Text;
  };

  // Define a data type for storing files associated with a user principal.
  // HashMap where the key is the file name (Text) and the value is the File data.
  type UserFiles = HashMap.Map<Text, File>;

  // HashMap to store the user data.
  // The outer HashMap's key is the user's Principal, and the value is their UserFiles map.
  private var files = HashMap.new<Principal, UserFiles>();

  // Return files associated with a user's principal.
  // If the user has no files yet, it initializes an empty file map for them.
  private func getUserFiles(user : Principal) : UserFiles {
    switch (HashMap.get(files, phash, user)) { // Use direct user principal for HashMap.get
      case null {
        // User not found, create a new entry for them
        let newFileMap = HashMap.new<Text, File>();
        // `put` returns an Option, so we ignore it with `let _ = ...`
        let _ = HashMap.put(files, phash, user, newFileMap);
        newFileMap;
      };
      case (?existingFiles) {
        // User found, return their existing files map
        existingFiles;
      };
    };
  };

  // Check if a file name already exists for the user.
  // `msg.caller` provides the Principal of the user making the call.
  public shared (msg) func checkFileExists(name : Text) : async Bool {
    Option.isSome(HashMap.get(getUserFiles(msg.caller), thash, name)); // Use direct name for HashMap.get
  };

  // Upload a file in chunks.
  public shared (msg) func uploadFileChunk(name : Text, chunk : Blob, index : Nat, fileType : Text) : async () {
    let userFiles = getUserFiles(msg.caller);
    let fileChunk = { chunk = chunk; index = index };

    switch (HashMap.get(userFiles, thash, name)) {
      case null {
        let _ = HashMap.put(userFiles, thash, name, { name = name; chunks = [fileChunk]; totalSize = chunk.size(); fileType = fileType });
      };
      case (?existingFile) {
        let updatedChunks = Array.append(existingFile.chunks, [fileChunk]);
        let _ = HashMap.put(
          userFiles,
          thash,
          name,
          {
            name = name;
            chunks = updatedChunks;
            totalSize = existingFile.totalSize + chunk.size();
            fileType = fileType;
          }
        );
      };
    };
  };

  // Return list of files for a user (name, size, type).
  public shared (msg) func getFiles() : async [{ name : Text; size : Nat; fileType : Text }] {
    let userFilesMap = getUserFiles(msg.caller);
    // Iterate over the values (Files) of the user's file map
    Iter.toArray(
      Iter.map(
        HashMap.vals(userFilesMap),
        func(file : File) : { name : Text; size : Nat; fileType : Text } {
          {
            name = file.name;
            size = file.totalSize;
            fileType = file.fileType;
          };
        }
      )
    );
  };

  // Return total number of chunks for a specific file.
  public shared (msg) func getTotalChunks(name : Text) : async Nat {
    switch (HashMap.get(getUserFiles(msg.caller), thash, name)) {
      case null 0;
      case (?file) file.chunks.size();
    };
  };


  // Return a specific chunk for a file by its index.
  public shared (msg) func getFileChunk(name : Text, index : Nat) : async ?Blob {
    switch (HashMap.get(getUserFiles(msg.caller), thash, name)) {
      case null null;
      case (?file) {
        switch (Array.find(file.chunks, func(chunk : FileChunk) : Bool { chunk.index == index })) {
          case null null;
          case (?foundChunk) ?foundChunk.chunk;
        };
      };
    };
  };

  // Get a file's type.
  public shared (msg) func getFileType(name : Text) : async ?Text {
    switch (HashMap.get(getUserFiles(msg.caller), thash, name)) {
      case null null;
      case (?file) ?file.fileType;
    };
  };

  // Delete a file.
  // Returns true if the file was found and removed, false otherwise.
  public shared (msg) func deleteFile(name : Text) : async Bool {
    Option.isSome(HashMap.remove(getUserFiles(msg.caller), thash, name));
  };
};
