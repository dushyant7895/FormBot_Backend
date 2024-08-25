const User = require("../Model/user");
const Form = require("../Model/Form");
const { v4: uuidv4 } = require('uuid');
const mongoose=require('mongoose')

exports.saveForm = async (req, res) => {
  try {
    const { formname, folderId, theme, fields } = req.body;
    const userId = req.user.userId;
    const uniqueUrl = uuidv4();

    console.log("Received form details:", { formname, folderId, theme, fields, userId, uniqueUrl });

    const newForm = new Form({
      formname,
      userId,
      folderId: folderId || null,
      theme,
      views: 0,
      starts: 0,
      completionrate: 0,
      fields,
      uniqueUrl
    });

    await newForm.save();
    console.log("Form saved successfully:", newForm);
    res.status(201).json({ message: "Form saved successfully", form: newForm });
  } catch (error) {
    console.error("Error saving form:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



exports.fetchform = async (req, res) => {
    try {
      const { formId } = req.params;
  
      let form;
      if (mongoose.Types.ObjectId.isValid(formId)) {
        form = await Form.findById(formId);
      } else {
        form = await Form.findOne({ uniqueUrl: formId });
      }
  
      if (form) {
        res.status(200).json({
          success: true,
          message: 'Form fetched successfully',
          form
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Form not found'
        });
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching form',
        error
      });
    }
  };

exports.deleteform = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteform = await Form.findByIdAndDelete(id);
        if (!deleteform) {
            return res.status(404).json({ message: "Form not found" });
        }
        res.status(200).json({ message: "Form deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Form", error });
    }
}

exports.getFormByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const forms = await Form.find({ userId: userId });
        if (!forms) {
            return res.status(404).json({ message: 'Forms not found' });
        }
        res.status(200).json(forms);
    } catch (error) {
        console.error("Error fetching forms:", error);
        res.status(500).json({ message: error.message });
    }
}

exports.fetchByUniqueUrl = async (req, res) => {
  try {
    const { uniqueUrl } = req.params;
    console.log(`Fetching form with uniqueUrl: ${uniqueUrl}`);
    const form = await Form.findOne({ uniqueUrl });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json({ form });
  } catch (error) {
    console.error('Error fetching form by unique URL:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.saveResponse = async (req, res) => {
    try {
        const { uniqueUrl } = req.params;
        const response = req.body;

        const form = await Form.findOne({ uniqueUrl });
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        if (!form.responses) {
            form.responses = [];
        }

        form.responses.push(response);

        await form.save();
        res.status(200).json({ message: 'Response saved successfully' });
    } catch (error) {
        console.error("Error saving response:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getFormsByFolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        const forms = await Form.find({ folderId });
        if (!forms) {
            return res.status(404).json({ message: 'Forms not found' });
        }
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateTheme = async (req, res) => {
  try {
    const { formId } = req.params;
    const { theme } = req.body;

    console.log(`Received request to update theme for formId: ${formId} to ${theme}`);

    let form;
    if (mongoose.Types.ObjectId.isValid(formId)) {
      form = await Form.findByIdAndUpdate(formId, { theme }, { new: true });
    } else {
      form = await Form.findOneAndUpdate({ uniqueUrl: formId }, { theme }, { new: true });
    }

    if (!form) {
      console.log(`Form not found for formId: ${formId}`);
      return res.status(404).send({ message: 'Form not found' });
    }

    console.log(`Theme updated successfully for formId: ${formId}`);
    res.send(form);
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).send({ message: 'Error updating theme', error });
  }
};
